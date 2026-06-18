# mp-checkout

Crea una preferencia de Mercado Pago al vuelo para el **Diagnóstico Financiero
Express** y devuelve el `init_point` (URL del checkout). Permite controlar desde
el código el `back_urls` + `auto_return`, en vez de depender de un link estático
configurado en el panel de MP.

El frontend la llama desde `src/lib/checkout.ts` (`startDiagnosticoCheckout`).

## Flujo

1. El navegador hace `POST /functions/v1/mp-checkout` con `{ "product": "asesoria-express" }`.
2. La función crea la preferencia vía API de MP con:
   - `back_urls.success` → página externa de agendamiento.
   - `auto_return: "approved"` → MP redirige solo tras pago aprobado.
   - `notification_url` → `mp-webhook`.
   - `external_reference` → `asesoria-express`.
3. Devuelve `{ init_point }` y el frontend redirige ahí.

## Secrets

```
MP_ACCESS_TOKEN          Access Token de Mercado Pago (mismo que usa mp-webhook)
DIAGNOSTICO_SUCCESS_URL  (opcional) URL de retorno tras pago aprobado.
                         Default: https://drbrito-ai.vercel.app/diagnostico-express
```

`SUPABASE_URL` lo inyecta Supabase automáticamente.

## Deploy

Se llama desde el navegador, así que va **sin** verificación de JWT:

```
supabase functions deploy mp-checkout --no-verify-jwt
```

## Notas

- Yape se excluye en la preferencia (su aprobación no siempre es instantánea y
  el retorno depende de `auto_return`). Quita `payment_methods` si lo necesitas.
- Para producción, usa el `MP_ACCESS_TOKEN` de producción.
