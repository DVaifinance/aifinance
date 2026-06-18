import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '@/hooks/useInView'
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  MessageCircle,
  MessageCircleMore,
  Scale,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ASESORIA_EXPRESS_LINK, CALENDLY_URL } from '@/lib/checkout'

type RemainingTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemainingTime(targetDate: number): RemainingTime {
  const now = Date.now()
  const diff = Math.max(0, targetDate - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

const WA_NUMBER = '51907979298'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/plantillas`

// === Mercado Pago: Links de pago por plantilla =============================
// Pega aquí el "Link de pago" que generes en tu panel de Mercado Pago para
// cada plantilla. En CADA link, configura la "URL de retorno" (back URL) de
// pago aprobado apuntando a este sitio con el parámetro `plan`, por ejemplo:
//
//   https://tu-dominio.com/?plan=finanstart
//
// Mercado Pago añadirá automáticamente `&status=approved` al volver de un pago
// exitoso, y este sitio disparará la descarga de la plantilla correspondiente.
// Mientras un link esté vacío, el botón hará descarga directa (modo prueba).
const PAYMENT_LINKS: Record<string, string> = {
  // PRODUCCIÓN (cobro real). Solo FinanStart está en vivo por ahora; los demás
  // siguen en sandbox. La URL de retorno de este link DEBE apuntar a
  // /servicios?plan=finanstart para que se disparen las descargas al volver.
  finanstart:
    'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=3410303242-7e12e802-d5fb-4a5d-9a2a-ad6dbcd6421b',
  // PRUEBA (sandbox de Mercado Pago): paga con tarjetas de prueba. Reemplaza por
  // los links de producción cuando salgas a vivo. La URL de retorno apunta a
  // /servicios?plan=<slug>, que es donde vive la lógica de descarga.
  finanpro:
    'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=3410303242-f965745f-36b0-47dd-a6c2-96d70b99c8c6',
  finandirectivo:
    'https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=3410303242-9efc0987-a19f-4414-b5cd-9a598d3cebb3',
}

// Fuerza la descarga del archivo. Intenta vía blob (renombra el archivo) y, si
// el navegador lo bloquea por CORS, cae a abrir la URL directamente.
function triggerDownload(url: string, filename: string) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    })
    .catch(() => {
      window.location.assign(url)
    })
}

// Descarga todos los archivos asociados a un plan (Excel, manual PDF, etc.).
function downloadPlanFiles(plan: (typeof plans)[number]) {
  plan.files.forEach((file) => {
    triggerDownload(`${STORAGE_BASE}/${file}`, file)
  })
}

// Lee de la URL el plan cuyo pago fue aprobado al volver de Mercado Pago.
function getApprovedPlanName(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status') ?? params.get('collection_status')
  const planSlug = params.get('plan')
  if (status === 'approved' && planSlug) {
    return plans.find((p) => p.slug === planSlug)?.name ?? null
  }
  return null
}

// Ventana de oferta de 6 días que se fija en la primera visita y persiste entre
// recargas (no se reinicia al refrescar la página).
const OFFER_WINDOW_MS = 6 * 24 * 60 * 60 * 1000
const OFFER_DEADLINE_KEY = 'aifinance:offer-deadline'

function getOfferDeadline(): number {
  if (typeof window === 'undefined') return Date.now() + OFFER_WINDOW_MS

  const stored = window.localStorage.getItem(OFFER_DEADLINE_KEY)
  const parsed = stored ? Number(stored) : NaN

  // Reutiliza la fecha guardada mientras siga vigente; si no, abre una ventana nueva.
  if (Number.isFinite(parsed) && parsed > Date.now()) {
    return parsed
  }

  const deadline = Date.now() + OFFER_WINDOW_MS
  window.localStorage.setItem(OFFER_DEADLINE_KEY, String(deadline))
  return deadline
}

const credibilityItems = [
  {
    icon: Building2,
    label: 'Ex-banquero BBVA e Interbank',
  },
  {
    icon: GraduationCap,
    label: 'Ingeniería Industrial PUCP',
  },
  {
    icon: BriefcaseBusiness,
    label: 'Head of Finance · Empresa Agroexportadora',
  },
  {
    icon: Globe2,
    label: 'Especialista en empresas de Latinoamérica',
  },
]

const painPoints = [
  'Confundes cuánto entra con cuánto ganas realmente',
  'Tu contador te da papeles que no entiendes',
  'El banco te pidió estados financieros y no los tienes',
  'No sabes si puedes contratar, invertir o pedir un préstamo',
  'Terminas el mes sin saber por qué no sobró dinero',
]

const plans = [
  {
    level: 'Nivel 01',
    name: 'FinanStart',
    slug: 'finanstart',
    tagline: 'Tu primer control financiero',
    description: 'Deja de adivinar cuánto ganas.',
    regularPrice: 'S/98',
    offerPrice: 'S/49',
    audience: 'Para ti si facturas hasta S/50k/año',
    features: [
      'Registro mensual de ingresos y gastos',
      'Estado de Resultados automático',
      'Balance General básico',
      '5 indicadores clave con semáforo visual',
      'Guía de uso en 3 pasos (lenguaje simple)',
    ],
    bonus: 'Bonus gratis: Guía PDF explicativa',
    cta: 'Quiero FinanStart',
    files: [
      'FinanStart_DB_AiFinance.2026.V4.xlsx',
      'Manual_FinanStart_DB_AiFinance.2026.V4.pdf',
    ],
    featured: false,
  },
  {
    level: 'Nivel 02',
    name: 'FinanPro',
    slug: 'finanpro',
    tagline: 'Control y proyección para negocios en expansión',
    description: 'Sabe adónde va tu dinero.',
    regularPrice: 'S/218',
    offerPrice: 'S/109',
    audience: 'Para ti si facturas S/50k-S/150k/año',
    features: [
      'Todo lo de FinanStart +',
      'EE.RR con estructura PCGE completa',
      'Balance General avanzado',
      'Flujo de caja proyectado a 3 meses',
      '10 ratios financieros con semáforo',
      'Dashboard visual con 2 gráficos en Excel',
      'Comparativo mes anterior automático',
    ],
    bonus: 'Bonus gratis: Guía PDF explicativa',
    cta: 'Quiero FinanPro',
    files: ['MEDIANO.xlsx'],
    featured: true,
  },
  {
    level: 'Nivel 03',
    name: 'FinanDirectivo',
    slug: 'finandirectivo',
    tagline: 'Finanzas de alta gerencia',
    description: 'La visión financiera que tienen las grandes empresas, ahora en la tuya.',
    regularPrice: 'S/358',
    offerPrice: 'S/179',
    audience: 'Para ti si facturas más de S/150k/año',
    features: [
      'Todo lo de FinanPro +',
      'EE.RR 12 meses + comparativo año anterior',
      'Flujo de caja operativo, inversión y financiamiento',
      '15 ratios con semáforo visual',
      'Dashboard ejecutivo con 4 gráficos en Excel',
      'Hoja de presentación bancaria lista para imprimir',
      'Dashboard web interactivo con URL pública (Apps Script)',
    ],
    bonus: 'Bonus gratis: Guía PDF + Dashboard Web con URL pública',
    cta: 'Quiero FinanDirectivo',
    files: ['PRO.xlsx'],
    featured: false,
  },
]

const comparisonRows = [
  {
    feature: 'Estado de Resultados',
    values: ['check', 'check', 'check'],
  },
  {
    feature: 'Balance General',
    values: ['check', 'check', 'check'],
  },
  {
    feature: 'Flujo de Caja',
    values: ['dash', '3 meses', 'Completo'],
  },
  {
    feature: 'Ratios financieros',
    values: ['5', '10', '15'],
  },
  {
    feature: 'Dashboard Excel con gráficos',
    values: ['dash', 'check', 'check'],
  },
  {
    feature: 'Hoja presentación bancaria',
    values: ['dash', 'dash', 'check'],
  },
  {
    feature: 'Dashboard web con URL pública',
    values: ['dash', 'dash', 'check'],
  },
  {
    feature: 'Guía PDF explicativa',
    values: ['check', 'check', 'check'],
  },
]

// === Nivel 2 · Servicios puntuales =========================================
// Entregables concretos, pago 100% adelantado. Precio con 20% de descuento de
// lanzamiento (se muestra el precio original tachado + el precio con descuento).
const puntualServices = [
  {
    code: '2A',
    icon: FileText,
    badge: '7 días',
    title: 'Plan de negocio integral',
    description:
      'Para empresas que necesitan presentarse ante un socio, fondo de inversión o banco de desarrollo con un documento profesional y convincente.',
    deliverables: [
      'Modelo de negocio y análisis de mercado',
      'Proyecciones financieras + análisis de escenarios',
      'FODA financiero estructurado',
      'Deck ejecutivo en PDF listo para presentar',
    ],
    regularPrice: 'S/ 2,000',
    price: 'S/ 1,600',
    delivery: '7 días',
  },
  {
    code: '2B',
    icon: Landmark,
    badge: '7 días',
    title: 'Plan financiero bancario',
    description:
      'Para empresas que ya tienen operación y necesitan estructurar su información financiera para acceder a crédito bancario en las mejores condiciones.',
    deliverables: [
      'Proyecciones financieras a 3 años con supuestos',
      'Flujo de caja mensual proyectado',
      'Análisis de ratio deuda / EBITDA explicado',
      'Memo ejecutivo de una página para banco',
    ],
    regularPrice: 'S/ 2,375',
    price: 'S/ 1,900',
    delivery: '7 días',
  },
  {
    code: '2C',
    icon: Scale,
    badge: '1–3 semanas',
    title: 'Estructuración de deuda',
    description:
      'Para empresas con deuda costosa o mal estructurada que necesitan un plan negociable ante sus acreedores o una propuesta de refinanciamiento viable.',
    deliverables: [
      'Mapa completo de pasivos actuales',
      'Comparativa de alternativas de refinanciamiento',
      'Propuesta formal a acreedor (carta ejecutiva)',
      'Cronograma de pagos sostenible',
    ],
    regularPrice: 'S/ 3,625',
    price: 'S/ 2,900',
    delivery: '1–3 sem.',
  },
]

const faqs = [
  {
    question: '¿Necesito saber contabilidad para usar las plantillas?',
    answer:
      'No. Están diseñadas para empresarios, no para contadores. Cada campo tiene instrucciones claras y la guía PDF te explica paso a paso qué ingresar y cómo interpretar los resultados. Si sabes usar Excel básico, puedes usarlas.',
  },
  {
    question: '¿Funcionan con Google Sheets?',
    answer:
      'Sí. Las plantillas se entregan en formato .xlsx, compatible tanto con Microsoft Excel como con Google Sheets. Las fórmulas y los gráficos funcionan en ambas plataformas.',
  },
  {
    question: '¿Qué incluye el dashboard web de FinanDirectivo?',
    answer:
      'Incluye una vista web ejecutiva con indicadores clave, gráficos y una URL pública para revisar tus números sin abrir el Excel. Es ideal para seguimiento gerencial y presentación rápida.',
  },
  {
    question: '¿Cómo recibo la plantilla después de comprar?',
    answer:
      'Inmediatamente después de aprobar el pago, el sitio te lleva de vuelta y descarga automáticamente el archivo Excel de tu plantilla. La entrega es instantánea. Si tienes cualquier inconveniente con la descarga, escríbenos por WhatsApp y te la enviamos.',
  },
  {
    question: '¿El precio de 50% OFF es permanente?',
    answer:
      'No. Es una oferta de lanzamiento válida solo esta semana. El precio normal de FinanStart es S/98, FinanPro S/218 y FinanDirectivo S/358. Una vez terminada la oferta, el precio vuelve a su valor normal sin excepciones.',
  },
]

function renderComparisonValue(value: string, featured = false) {
  if (value === 'check') {
    return <span className="text-3xl font-bold text-emerald-600">✓</span>
  }

  if (value === 'dash') {
    return <span className="text-2xl text-zinc-400">-</span>
  }

  return (
    <span
      className={[
        'text-lg font-extrabold sm:text-2xl',
        featured ? 'text-emerald-600' : 'text-amber-600',
      ].join(' ')}
    >
      {value}
    </span>
  )
}

function Countdown({
  label,
  time,
  cellClassName,
  labelClassName = 'text-amber-200/90',
  numberClassName = 'text-amber-300',
  unitClassName = 'text-zinc-300',
}: {
  label: string
  time: RemainingTime
  cellClassName: string
  labelClassName?: string
  numberClassName?: string
  unitClassName?: string
}) {
  const units: { value: number; label: string }[] = [
    { value: time.days, label: 'Días' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ]

  return (
    <>
      <p className={`mb-3 text-xs font-semibold tracking-[0.18em] uppercase ${labelClassName}`}>
        {label}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div key={unit.label} className={cellClassName}>
            <p className={`text-2xl font-bold tabular-nums sm:text-4xl ${numberClassName}`}>
              {pad(unit.value)}
            </p>
            <p className={`text-[11px] tracking-[0.16em] uppercase ${unitClassName}`}>
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

function ServiciosPage() {
  const [targetDate] = useState(getOfferDeadline)
  const [remainingTime, setRemainingTime] = useState<RemainingTime>(() =>
    getRemainingTime(targetDate),
  )
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0)
  const [paidPlanName, setPaidPlanName] = useState<string | null>(getApprovedPlanName)
  useInView()

  useEffect(() => {
    document.title = 'Plantillas financieras · David Brito AI Finance'
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(getRemainingTime(targetDate))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  // Al volver desde Mercado Pago: si el pago fue aprobado, descarga la plantilla
  // del plan indicado en la URL y limpia los parámetros para no redescargar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status') ?? params.get('collection_status')
    const planSlug = params.get('plan')
    const asesoria = params.get('asesoria')

    // Asesoría express pagada → llevar a Calendly para agendar.
    if (status === 'approved' && asesoria === 'express') {
      window.location.assign(CALENDLY_URL)
      return
    }

    // Plantilla pagada → descargar los archivos del plan correspondiente.
    if (status === 'approved' && planSlug) {
      const plan = plans.find((p) => p.slug === planSlug)
      if (plan) {
        downloadPlanFiles(plan)
      }
    }

    if (status || planSlug || asesoria) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Inicia el cobro de la asesoría express (S/59) en Mercado Pago. Al aprobarse
  // el pago, el cliente vuelve a /servicios?asesoria=express y se le redirige a
  // Calendly. El monto real del servicio se define dentro de la asesoría.
  function handleAsesoriaExpress() {
    window.location.assign(ASESORIA_EXPRESS_LINK)
  }

  // Oculta el banner de pago aprobado automáticamente tras unos segundos.
  useEffect(() => {
    if (!paidPlanName) return
    const timeoutId = setTimeout(() => setPaidPlanName(null), 10000)
    return () => clearTimeout(timeoutId)
  }, [paidPlanName])

  // Inicia el cobro en Mercado Pago. Si el plan aún no tiene link configurado,
  // hace descarga directa (modo prueba) para no bloquear el flujo.
  function handleBuy(plan: (typeof plans)[number]) {
    const paymentLink = PAYMENT_LINKS[plan.slug]
    if (paymentLink) {
      window.location.assign(paymentLink)
    } else {
      downloadPlanFiles(plan)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAF7] text-[#0F2A22]">

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="inline-flex items-center transition hover:opacity-80" aria-label="David Brito · AI Finance — Inicio">
          <img src="/logo-green.svg" alt="David Brito · AI Finance" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-emerald-900/70 transition hover:text-[#0F2A22]"
          >
            ← Inicio
          </Link>
          {[
            { label: 'Plantillas', target: 'pricing' },
          ].map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() =>
                document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm font-medium text-emerald-900/70 transition hover:text-[#0F2A22]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Button
          className="h-10 rounded-xl bg-[#0F2A22] px-4 text-sm font-semibold text-white transition hover:bg-[#15392c]"
          size="lg"
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver Plantillas
        </Button>
      </header>

      <main className="relative z-10">
        {paidPlanName ? (
          <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-xl rounded-2xl border border-emerald-700/30 bg-emerald-600 px-5 py-4 pr-10 text-center shadow-[0_20px_60px_-30px_rgba(15,42,34,0.6)] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
            <button
              type="button"
              onClick={() => setPaidPlanName(null)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              ✕
            </button>
            <p className="text-sm font-semibold text-white sm:text-base">
              ✓ Pago aprobado. Descargando tu plantilla <span className="text-amber-200">{paidPlanName}</span>.
            </p>
            <p className="mt-1 text-xs text-emerald-50/90">
              Si la descarga no inicia automáticamente, revisa los permisos de descarga de tu navegador.
            </p>
          </div>
        ) : null}

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-7xl items-center justify-center px-5 pb-14 pt-6 sm:px-8 sm:pb-20">
          <div className="w-full max-w-4xl text-center">
          <p className="reveal mx-auto inline-flex items-center rounded-full bg-amber-300/30 px-4 py-2 text-xs font-bold tracking-[0.14em] text-emerald-950 uppercase sm:text-sm">
            Oferta de lanzamiento · 50% OFF
          </p>

          <h1 className="reveal reveal-delay-1 mt-8 font-display text-[2.35rem] leading-tight tracking-tight text-[#0F2A22] sm:text-[4rem] sm:leading-[0.95] md:text-[5.4rem]">
            Las herramientas financieras que usan
            <span className="mt-2 block text-amber-500">las grandes empresas</span>
            <span className="mt-2 block">ahora en la tuya</span>
          </h1>

          <p className="reveal reveal-delay-2 mx-auto mt-8 max-w-2xl text-base leading-relaxed text-emerald-900/70 sm:text-xl">
            Plantillas profesionales para que empresarios peruanos entiendan sus
            números, controlen su negocio y lleguen al banco con datos que
            impresionan.
          </p>

          <div className="reveal reveal-delay-3 mx-auto mt-10 max-w-xl rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)]">
            <Countdown
              label="La oferta termina en"
              time={remainingTime}
              cellClassName="rounded-xl border border-emerald-900/8 bg-[#FAF6EC] p-2 sm:p-3"
              labelClassName="text-amber-600"
              numberClassName="text-[#0F2A22]"
              unitClassName="text-amber-600/80"
            />
          </div>

          <p className="reveal reveal-delay-4 mx-auto mt-4 inline-flex rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
            Descuento del 50% · Solo esta semana · El precio sube pronto
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              className="h-12 rounded-xl bg-[#0F2A22] px-8 text-base font-semibold text-white hover:bg-[#15392c]"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quiero la oferta
            </Button>
          </div>
          </div>
        </section>

        <section className="border-y border-emerald-900/10 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-4 sm:px-8">
            {credibilityItems.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={['reveal flex items-center gap-3 text-center text-sm text-emerald-900/70 sm:text-left', `reveal-delay-${Math.min(i + 1, 5)}`].join(' ')}>
                <Icon className="size-4 shrink-0 text-amber-600" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="reveal reveal--left rounded-[2rem] border border-transparent p-0 lg:pr-6">
              <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                El problema
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
                ¿Te identificas con alguna de estas situaciones?
              </h2>

              <div className="mt-8 divide-y divide-emerald-900/8 rounded-[1.75rem] border border-emerald-900/10 bg-white shadow-[0_20px_60px_-50px_rgba(15,42,34,0.4)]">
                {painPoints.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 px-4 py-5 text-left text-base text-emerald-900/80 sm:px-6 sm:text-[1.05rem]"
                  >
                    <div
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-lg ring-1 ring-amber-400/25"
                    >
                      {index === 0 && '😵'}
                      {index === 1 && '📄'}
                      {index === 2 && '🏦'}
                      {index === 3 && '🤷'}
                      {index === 4 && '📉'}
                    </div>
                    <p className="leading-relaxed text-emerald-900/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="reveal reveal--right rounded-[2rem] border border-amber-200/20 bg-[linear-gradient(180deg,rgba(34,74,58,0.95),rgba(13,43,35,0.95))] p-7 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.85)] sm:p-9">
              <h3 className="max-w-md font-display text-3xl leading-tight text-amber-300 sm:text-4xl">
                La solución ya existe y cuesta menos que una hora de consultoría
              </h3>

              <p className="mt-6 text-lg leading-relaxed text-zinc-200/90">
                Estas plantillas están diseñadas por un profesional con
                experiencia en banca corporativa para que tú mismo
                <span className="font-semibold text-amber-300">
                  {' '}puedas entender tus números
                </span>{' '}
                en menos de 10 minutos al mes.
              </p>

              <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                Sin jerga contable. Sin depender de nadie. Con semáforos que te
                dicen exactamente qué está bien y qué necesita tu atención.
              </p>

              <div className="mt-8 rounded-2xl border border-amber-200/10 bg-amber-300/8 p-5 text-base font-semibold leading-relaxed text-amber-200">
                <div className="flex items-start gap-3">
                  <Banknote className="mt-0.5 size-5 shrink-0 text-amber-300" />
                  <p>
                    El mismo sistema que uso con mis clientes corporativos,
                    adaptado para que lo uses solo.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-7xl px-5 pb-20 pt-4 sm:px-8 sm:pb-28">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
              Elige tu plantilla
            </p>
            <h2 className="mx-auto mt-5 max-w-5xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl lg:text-6xl">
              Tres niveles.
              <span className="text-amber-500"> Una sola decisión.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3 xl:gap-5">
            {plans.map((plan, i) => (
              <article
                key={plan.name}
                className={[
                  `reveal reveal--scale reveal-delay-${i + 1} relative flex h-full flex-col rounded-[2rem] border bg-white p-7 shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-45px_rgba(15,42,34,0.4)] sm:p-8`,
                  plan.featured
                    ? 'border-amber-400/60 ring-2 ring-amber-300/40 xl:scale-[1.04]'
                    : 'border-emerald-900/10 hover:border-amber-300/40',
                ].join(' ')}
              >
                {plan.featured ? (
                  <div className="absolute right-4 top-0 -translate-y-1/2 rounded-b-xl rounded-t-md bg-amber-400 px-4 py-2 text-xs font-black tracking-[0.12em] text-emerald-950 uppercase shadow-lg">
                    Más cotizado
                  </div>
                ) : null}

                <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                  {plan.level}
                </p>

                <h3 className="mt-5 font-display text-4xl text-[#0F2A22] sm:text-[2.8rem]">
                  {plan.name}
                </h3>

                <p className="mt-2 text-lg font-medium italic text-emerald-900/55">
                  {`"${plan.tagline}"`}
                </p>
                <p className="text-lg text-emerald-900/55">{plan.description}</p>

                <div className="mt-8">
                  <p className="text-2xl text-zinc-400 line-through">
                    Precio normal: {plan.regularPrice}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="font-sans text-5xl font-black tracking-tight text-[#0F2A22] sm:text-6xl">
                      {plan.offerPrice}
                    </p>
                    <span className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-black tracking-[0.14em] text-red-600 uppercase">
                      50% off
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-emerald-900/8 pt-6">
                  <p className="text-sm font-extrabold tracking-[0.06em] text-amber-600 uppercase sm:text-base">
                    {plan.audience}
                  </p>
                </div>

                <ul className="mt-6 space-y-0.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border-b border-emerald-900/8 py-3 text-base leading-relaxed text-emerald-900/80 sm:text-[1.05rem]"
                    >
                      <Check className="mt-1 size-4 shrink-0 text-amber-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-emerald-600/15 bg-emerald-500/8 px-4 py-4 text-sm font-bold leading-relaxed text-emerald-700 sm:text-base">
                  {plan.bonus}
                </div>

                <div className="mt-6 flex flex-1 items-end">
                  <Button
                    onClick={() => handleBuy(plan)}
                    className={[
                      'h-14 w-full rounded-2xl border-2 px-6 text-base font-black tracking-[0.02em] sm:text-lg',
                      plan.featured
                        ? 'border-amber-300 bg-amber-400 text-emerald-950 hover:bg-amber-300'
                        : 'border-[#0F2A22]/15 bg-transparent text-[#0F2A22] hover:bg-[#0F2A22]/5',
                    ].join(' ')}
                  >
                    {plan.cta} {'->'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
              Compara
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
              ¿Cuál es la
              <span className="text-amber-500"> diferencia?</span>
            </h2>
          </div>

          <div className="reveal reveal-delay-1 mt-10 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_30px_80px_-55px_rgba(15,42,34,0.4)]">
            <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] border-b border-emerald-900/8 bg-[#FAFAF7] md:grid">
              <div className="px-5 py-5 text-left text-lg font-black tracking-[0.05em] text-amber-600 uppercase">
                Función
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-[#0F2A22] uppercase">FinanStart</p>
                <p className="text-lg font-bold text-amber-600">S/49</p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-[#0F2A22] uppercase">FinanPro</p>
                <p className="text-lg font-bold text-amber-600">S/109</p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-[#0F2A22] uppercase">FinanDirectivo</p>
                <p className="text-lg font-bold text-amber-600">S/179</p>
              </div>
            </div>

            <div className="divide-y divide-emerald-900/8">
              {comparisonRows.map((row) => (
                <div key={row.feature}>
                  <div className="px-5 py-4 text-left md:hidden">
                    <p className="text-base font-bold text-[#0F2A22]">{row.feature}</p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-emerald-900/8 bg-[#FAFAF7] p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-900/50 uppercase">
                          Start
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[0])}</div>
                      </div>
                      <div className="rounded-xl border border-emerald-900/8 bg-[#FAFAF7] p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-900/50 uppercase">
                          Pro
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[1], true)}</div>
                      </div>
                      <div className="rounded-xl border border-emerald-900/8 bg-[#FAFAF7] p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-900/50 uppercase">
                          Directivo
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[2])}</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] items-center md:grid">
                    <div className="px-5 py-5 text-left text-xl font-semibold text-[#0F2A22]">
                      {row.feature}
                    </div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[0])}</div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[1], true)}</div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[2])}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NIVEL 2 · Servicios puntuales ── */}
        <section id="servicios-puntuales" className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="reveal text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                Nivel 2 · Servicios puntuales
              </p>
              <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
                ¿Necesitas algo
                <span className="text-amber-500"> a la medida?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
                Entregables concretos para necesidades específicas. Lo hacemos por
                ti, con pago al 100% por adelantado y resultado en 7 días o menos.
              </p>
              <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300/25 px-4 py-2 text-xs font-bold tracking-[0.1em] text-emerald-950 uppercase">
                <Sparkles className="size-4 text-amber-600" /> Cotización a medida · sin compromiso
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
              {puntualServices.map((service, i) => {
                const Icon = service.icon
                return (
                  <article
                    key={service.code}
                    className={`reveal reveal--scale reveal-delay-${i + 1} relative flex h-full flex-col rounded-[2rem] border border-emerald-900/10 bg-[#FAFAF7] p-7 shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-300/40 sm:p-8`}
                  >
                    <div className="absolute right-5 top-6 rounded-full bg-amber-300/20 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-amber-700 uppercase">
                      {service.badge}
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/15">
                      <Icon className="size-6 text-amber-600" />
                    </div>

                    <p className="mt-5 text-xs font-bold tracking-[0.18em] text-amber-600/70 uppercase">
                      {service.code}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-[#0F2A22]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-emerald-900/70">
                      {service.description}
                    </p>

                    <ul className="mt-6 space-y-0.5">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 border-b border-emerald-900/8 py-3 text-base leading-relaxed text-emerald-900/80"
                        >
                          <Check className="mt-1 size-4 shrink-0 text-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-amber-300/15 px-3 py-2 text-sm font-semibold text-amber-700">
                      <Sparkles className="size-4" /> Incluye reporte Sentinel gratis
                    </div>

                    <div className="mt-6 flex items-end justify-between border-t border-emerald-900/8 pt-6">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-amber-600/70 uppercase">
                          Inversión
                        </p>
                        <p className="mt-1 font-sans text-2xl font-black tracking-tight text-[#0F2A22]">
                          A cotizar
                        </p>
                        <p className="text-xs text-emerald-900/55">Según el alcance</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] tracking-[0.12em] text-emerald-900/50 uppercase">
                          Entrega
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900/80">
                          <Clock className="size-3.5 text-amber-600" />
                          {service.delivery}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-1 items-end">
                      <Button
                        onClick={handleAsesoriaExpress}
                        className="h-13 w-full rounded-2xl border-2 border-[#0F2A22]/15 bg-transparent px-6 text-base font-black text-[#0F2A22] hover:bg-[#0F2A22]/5"
                      >
                        Solicitar este servicio
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
              Preguntas frecuentes
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
              Todo lo que necesitas
              <span className="text-amber-500"> saber</span>
            </h2>
          </div>

          <div className="reveal reveal-delay-1 mt-12 divide-y divide-emerald-900/10 border-y border-emerald-900/10">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index

              return (
                <div key={faq.question} className="py-3 sm:py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left"
                  >
                    <span className="text-xl font-bold text-[#0F2A22] sm:text-2xl">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={[
                        'size-5 shrink-0 text-amber-600 transition-transform duration-200',
                        isOpen ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>

                  {isOpen ? (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-1 pb-4 pt-1 text-lg leading-relaxed text-emerald-900/70 sm:pb-6 sm:text-xl"
                    >
                      <p className="max-w-5xl">{faq.answer}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-t border-amber-200/10 bg-[#07160f]">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <h2 className="reveal mx-auto max-w-5xl font-display text-5xl leading-tight tracking-tight text-[#FFFFFF] sm:text-6xl sm:leading-[0.95] md:text-7xl">
              Tu negocio merece
              <span className="mt-3 block text-amber-300">números claros</span>
            </h2>

            <p className="reveal reveal-delay-1 mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
              Empieza hoy. En menos de una hora tendrás tu primer control financiero profesional.
            </p>

            <div className="reveal reveal-delay-2 mx-auto mt-10 max-w-xl rounded-2xl border border-emerald-300/15 bg-black/25 p-4 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.8)]">
              <Countdown
                label="El precio sube en"
                time={remainingTime}
                cellClassName="rounded-xl border border-emerald-200/15 bg-[#112d25] p-2 sm:p-3"
              />
            </div>

            <div className="reveal reveal-delay-3 mx-auto mt-10 flex max-w-3xl flex-col gap-4 sm:flex-row">
              <Button
                className="h-16 flex-1 rounded-2xl bg-amber-300 text-lg font-black text-emerald-950 hover:bg-amber-200"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Elegir mi plantilla {'->'}
              </Button>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola David, tengo una consulta sobre las plantillas')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1"
              >
                <Button
                  variant="outline"
                  className="h-16 w-full rounded-2xl border-amber-300/35 bg-transparent text-lg font-black text-amber-200 hover:bg-amber-300/10"
                >
                  <MessageCircleMore className="size-5" />
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>

            <p className="mx-auto mt-8 max-w-4xl text-sm leading-relaxed text-zinc-400 sm:text-lg">
              ✓ Entrega inmediata · ✓ Compatible con Excel y Google Sheets · ✓ Soporte por WhatsApp
            </p>
          </div>

          <footer className="border-t border-amber-200/10 px-5 py-8 text-center sm:px-8">
            <p className="text-sm font-semibold text-zinc-300 sm:text-base">
              <span className="text-amber-300">David Brito · AI Finance</span> · VCONN SAC · RUC 20611177977 · estrategia@dbaifinance.com
            </p>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              © 2025 Todos los derechos reservados · Lima, Perú ·{' '}
              <a href="/politica-privacidad/index.html" className="font-semibold text-amber-300 underline-offset-2 hover:underline">
                Política de Privacidad
              </a>
            </p>
          </footer>
        </section>
      </main>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola David, tengo una consulta sobre las plantillas financieras')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 font-semibold text-emerald-950 shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 sm:bottom-6 sm:left-6"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  )
}

export default ServiciosPage
