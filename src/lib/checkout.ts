// Configuración compartida de cobros (Mercado Pago).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

// Precio mostrado del Diagnóstico Financiero Express (precio fijo, sin oferta).
export const ASESORIA_EXPRESS_PRICE = 'S/118'

// Inicia el cobro del Diagnóstico Financiero Express. En vez de usar un link
// estático de Mercado Pago, crea la preferencia al vuelo vía la edge function
// `mp-checkout`, que define back_urls + auto_return hacia la página externa de
// agendamiento (https://drbrito-ai.vercel.app/diagnostico-express) y la
// notification_url hacia mp-webhook. Luego redirige al checkout de MP.
export async function startDiagnosticoCheckout(): Promise<void> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/mp-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: 'asesoria-express' }),
    })
    if (!res.ok) throw new Error(`mp-checkout respondió ${res.status}`)
    const data = await res.json()
    if (!data.init_point) throw new Error('respuesta sin init_point')
    window.location.assign(data.init_point as string)
  } catch (err) {
    console.error('No se pudo iniciar el checkout del diagnóstico:', err)
    alert('No pudimos iniciar el pago. Inténtalo de nuevo en unos segundos.')
  }
}
