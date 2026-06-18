// Configuración compartida de agenda y cobros (Mercado Pago).

export const CALENDLY_URL = 'https://calendly.com/estrategia-dbaifinance'

// Asesoría express (S/59). El cliente paga por Mercado Pago y, al aprobarse el
// pago, el sitio lo redirige a Calendly para agendar. El monto real de cada
// servicio de Nivel 2 se define DENTRO de esa asesoría.
//
// PRODUCCIÓN (cobro real) a S/59. Yape excluido.
// La URL de retorno apunta a /servicios?asesoria=express (lógica en ServiciosPage).
export const ASESORIA_EXPRESS_PRICE = 'S/59'
export const ASESORIA_EXPRESS_LINK =
  'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=3410303242-229637cc-170b-4d63-8d15-12d8d9b24905'
