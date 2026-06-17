# mp-webhook — Envío automático de plantilla por correo

Webhook de Mercado Pago que, al aprobarse un pago, envía por correo (Resend) la
plantilla comprada (adjunto + enlace) al email del comprador.

URL del webhook (una vez desplegada):

```
https://sapwhueyyakenvzserwk.supabase.co/functions/v1/mp-webhook
```

## 1. Tabla de idempotencia (evita correos duplicados)

En Supabase → SQL Editor, ejecuta:

```sql
create table if not exists public.sent_emails (
  payment_id text primary key,
  email      text not null,
  product    text not null,
  sent_at    timestamptz not null default now()
);

-- Solo la Edge Function (service role) escribe aquí; RLS no afecta a service role.
alter table public.sent_emails enable row level security;
```

## 2. Crear cuenta en Resend y verificar dominio

1. Crea cuenta en https://resend.com
2. **Domains** → agrega `dbaifinance.com` y añade los registros DNS que te indique
   (SPF/DKIM). Mientras no verifiques dominio, solo puedes enviar desde
   `onboarding@resend.dev` y a tu propio correo (suficiente para pruebas).
3. **API Keys** → crea una key (`re_...`).

## 3. Configurar secrets de la función

Dashboard → Edge Functions → Secrets (o CLI):

```
MP_ACCESS_TOKEN = <Access Token de Mercado Pago>
RESEND_API_KEY  = re_xxx
RESEND_FROM     = David Brito AI Finance <plantillas@dbaifinance.com>
```

`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya están disponibles automáticamente.

## 4. Desplegar

**Opción Dashboard (más simple):** Edge Functions → Create function → nombre
`mp-webhook` → pega el contenido de `index.ts` → **desactiva "Verify JWT"** →
Deploy.

**Opción CLI:**

```bash
supabase login
supabase link --project-ref sapwhueyyakenvzserwk
supabase functions deploy mp-webhook --no-verify-jwt
```

> Importante: debe quedar SIN verificación de JWT, porque Mercado Pago no envía
> token de autorización.

## 5. Conectar el webhook a los links de pago

Las preferencias de Mercado Pago deben incluir el `notification_url` apuntando a
esta función. Ya se regeneraron con ese campo (ver `src/lib/checkout.ts` y
`PAYMENT_LINKS` en `src/pages/ServiciosPage.tsx`).

## Notas

- En **producción**, cambia `MP_ACCESS_TOKEN` por el de producción y regenera
  los links de pago con ese token.
- El bucket `plantillas` debe ser público para que el adjunto y el enlace
  funcionen.
