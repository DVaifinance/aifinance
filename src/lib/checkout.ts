// Configuración compartida de agenda y cobros (Mercado Pago).

export const CALENDLY_URL = 'https://calendly.com/estrategia-dbaifinance'

// Asesoría express (S/59). El cliente paga por Mercado Pago y, al aprobarse el
// pago, el sitio lo redirige a Calendly para agendar. El monto real de cada
// servicio de Nivel 2 se define DENTRO de esa asesoría.
//
// PRUEBA (sandbox). Reemplaza por el link de producción al salir a vivo.
// La URL de retorno apunta a /servicios?asesoria=express (lógica en ServiciosPage).
export const ASESORIA_EXPRESS_PRICE = 'S/59'
export const ASESORIA_EXPRESS_LINK =
  'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=3410303242-a6d2b306-f8e8-4c52-b83e-8098f753e69d'
