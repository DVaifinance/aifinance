// Supabase Edge Function: mp-checkout
//
// Crea al vuelo una preferencia de Mercado Pago para el Diagnóstico Financiero
// Express y devuelve el `init_point` (URL del checkout). A diferencia de los
// links estáticos, aquí definimos nosotros:
//   - back_urls.success → página externa de agendamiento
//   - auto_return: 'approved' → MP redirige solo tras pagar
//   - notification_url → mp-webhook (para registros/correos)
//   - external_reference → 'asesoria-express'
//
// Secrets (Dashboard → Edge Functions → Secrets):
//   MP_ACCESS_TOKEN          Access Token de Mercado Pago (lado servidor)
//   DIAGNOSTICO_SUCCESS_URL  (opcional) URL de retorno tras pago aprobado
// Auto-inyectado por Supabase: SUPABASE_URL
//
// Se llama DESDE EL NAVEGADOR, así que desplegar sin verificación de JWT:
//   supabase functions deploy mp-checkout --no-verify-jwt

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUCCESS_URL =
  Deno.env.get('DIAGNOSTICO_SUCCESS_URL') ??
  'https://drbrito-ai.vercel.app/diagnostico-express'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Catalog = { title: string; price: number }

// external_reference → datos del producto. Debe coincidir con PRODUCTS en
// mp-webhook para que la conciliación posterior funcione.
const PRODUCTS: Record<string, Catalog> = {
  // PRUEBA: cobro a S/2. Para producción, vuelve a price: 59.
  'asesoria-express': { title: 'Diagnóstico Financiero Express', price: 2 },
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })

  try {
    const body = await req.json().catch(() => ({}))
    const code = String(body.product ?? 'asesoria-express')
    const product = PRODUCTS[code]
    if (!product) return json(400, { error: `producto desconocido: ${code}` })

    const origin = req.headers.get('origin') ?? ''

    const prefRes = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: product.title,
              quantity: 1,
              unit_price: product.price,
              currency_id: 'PEN',
            },
          ],
          external_reference: code,
          back_urls: {
            success: SUCCESS_URL,
            pending: SUCCESS_URL,
            failure: origin ? `${origin}/servicios` : SUCCESS_URL,
          },
          auto_return: 'approved',
          notification_url: `${SUPABASE_URL}/functions/v1/mp-webhook`,
          // Yape se excluye: su aprobación no siempre es instantánea y el flujo
          // depende de auto_return tras pago aprobado.
          payment_methods: {
            excluded_payment_methods: [{ id: 'yape' }],
          },
        }),
      },
    )

    const pref = await prefRes.json()
    if (!prefRes.ok) {
      return json(502, { error: 'mp_error', detail: pref })
    }

    return json(200, { init_point: pref.init_point, id: pref.id })
  } catch (e) {
    return json(500, { error: String(e) })
  }
})
