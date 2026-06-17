// Supabase Edge Function: mp-webhook
//
// Recibe la notificación (webhook) de Mercado Pago, verifica el pago contra la
// API de MP y, si está APROBADO, envía por correo (Resend) la plantilla
// correspondiente —como adjunto y enlace— al email del comprador.
//
// Secrets a configurar (Dashboard → Edge Functions → Secrets, o CLI
// `supabase secrets set`):
//   MP_ACCESS_TOKEN   Access Token de Mercado Pago (lado servidor)
//   RESEND_API_KEY    API key de Resend
//   RESEND_FROM       Remitente verificado en Resend,
//                     ej: "David Brito AI Finance <plantillas@dbaifinance.com>"
// Auto-inyectados por Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Desplegar SIN verificación de JWT (MP no envía token):
//   supabase functions deploy mp-webhook --no-verify-jwt
// (o en el Dashboard, desactiva "Verify JWT" en esta función)

import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const RESEND_FROM =
  Deno.env.get('RESEND_FROM') ?? 'David Brito AI Finance <onboarding@resend.dev>'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Solo para PRUEBAS: si se define, todos los correos se envían a esta dirección
// en vez de al email (ficticio) del comprador de sandbox. Déjalo vacío en
// producción para enviar al comprador real.
const TEST_EMAIL_OVERRIDE = Deno.env.get('TEST_EMAIL_OVERRIDE')

const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/plantillas`
const CALENDLY_URL = 'https://calendly.com/estrategia-dbaifinance'

type Product = { name: string; file?: string; calendly?: boolean }

// external_reference (definido al crear la preferencia) → producto.
const PRODUCTS: Record<string, Product> = {
  finanstart: { name: 'FinanStart', file: 'BASICO.xlsx' },
  finanpro: { name: 'FinanPro', file: 'MEDIANO.xlsx' },
  finandirectivo: { name: 'FinanDirectivo', file: 'PRO.xlsx' },
  'asesoria-express': { name: 'Asesoría Express', calendly: true },
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  try {
    // 1) Obtener el id del pago (MP lo manda por query o por body según versión).
    const url = new URL(req.url)
    let type = url.searchParams.get('type') ?? url.searchParams.get('topic')
    let paymentId =
      url.searchParams.get('data.id') ?? url.searchParams.get('id')

    if (req.method === 'POST') {
      const body = await req.json().catch(() => null)
      if (body) {
        type = type ?? body.type ?? body.action
        paymentId = paymentId ?? body?.data?.id ?? body?.id
      }
    }

    // Solo procesamos notificaciones de pago.
    if (type && !String(type).includes('payment')) {
      return json(200, { ignored: `type=${type}` })
    }
    if (!paymentId) return json(200, { ignored: 'sin payment id' })

    // 2) Consultar el pago real en Mercado Pago.
    const payRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } },
    )
    if (!payRes.ok) {
      // Respondemos 200 para que MP no reintente en bucle por un id inexistente.
      return json(200, {
        skipped: `no se pudo leer el pago ${paymentId} (${payRes.status})`,
      })
    }
    const payment = await payRes.json()

    if (payment.status !== 'approved') {
      return json(200, { skipped: `pago ${paymentId} en estado ${payment.status}` })
    }

    const ref = String(payment.external_reference ?? '')
    const email = payment.payer?.email as string | undefined
    const product = PRODUCTS[ref]

    if (!product || !email) {
      return json(200, { skipped: `sin producto (${ref}) o sin email` })
    }

    // 3) Idempotencia: reclamar el pago. Si ya existe, no reenviar el correo.
    const claim = await fetch(`${SUPABASE_URL}/rest/v1/sent_emails`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        payment_id: String(paymentId),
        email,
        product: ref,
      }),
    })
    if (claim.status === 409) {
      return json(200, { duplicate: String(paymentId) }) // ya enviado antes
    }

    // 4) Adjuntar el Excel (si el producto es una plantilla).
    let attachments: { filename: string; content: string }[] | undefined
    if (product.file) {
      const fileRes = await fetch(`${STORAGE_BASE}/${product.file}`)
      if (fileRes.ok) {
        const buf = new Uint8Array(await fileRes.arrayBuffer())
        attachments = [{ filename: product.file, content: encodeBase64(buf) }]
      }
    }

    // 5) Enviar el correo con Resend. En pruebas, TEST_EMAIL_OVERRIDE redirige
    //    todo a tu correo real (el de sandbox es ficticio y Resend lo rechaza).
    const recipient = TEST_EMAIL_OVERRIDE || email
    const { subject, html } = buildEmail(product)
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: recipient,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      }),
    })

    if (!sendRes.ok) {
      const errText = await sendRes.text()
      console.error(`Resend falló (${sendRes.status}): ${errText}`)
      // Liberar el claim para permitir el reintento de MP.
      await fetch(
        `${SUPABASE_URL}/rest/v1/sent_emails?payment_id=eq.${paymentId}`,
        {
          method: 'DELETE',
          headers: {
            apikey: SERVICE_ROLE,
            Authorization: `Bearer ${SERVICE_ROLE}`,
          },
        },
      )
      return json(500, { error: `Resend falló: ${errText}` })
    }

    return json(200, { sent: recipient, product: ref })
  } catch (e) {
    return json(500, { error: String(e) })
  }
})

function buildEmail(product: Product): { subject: string; html: string } {
  if (product.calendly) {
    return {
      subject: 'Tu asesoría está confirmada · David Brito AI Finance',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0F2A22">
          <h2>¡Pago recibido! 🎉</h2>
          <p>Gracias por adquirir la <strong>${product.name}</strong>.</p>
          <p>Agenda tu sesión en el siguiente enlace:</p>
          <p>
            <a href="${CALENDLY_URL}" style="background:#0F2A22;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;display:inline-block;font-weight:bold">Agendar mi asesoría</a>
          </p>
          <p style="color:#555">— David Brito · AI Finance</p>
        </div>`,
    }
  }

  const downloadUrl = `${STORAGE_BASE}/${product.file}`
  return {
    subject: `Tu plantilla ${product.name} está lista · David Brito AI Finance`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0F2A22">
        <h2>¡Gracias por tu compra! 🎉</h2>
        <p>Adjuntamos tu plantilla <strong>${product.name}</strong> en este correo.</p>
        <p>También puedes descargarla desde aquí:</p>
        <p>
          <a href="${downloadUrl}" style="background:#0F2A22;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;display:inline-block;font-weight:bold">Descargar mi plantilla (Excel)</a>
        </p>
        <p style="font-size:13px;color:#555">Si el botón no funciona, copia este enlace:<br>
          <a href="${downloadUrl}">${downloadUrl}</a>
        </p>
        <p style="color:#555">— David Brito · AI Finance</p>
      </div>`,
  }
}
