import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
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

const WA_NUMBER = '51951603568'

// Construye un enlace de WhatsApp con un mensaje prellenado.
function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/plantillas`

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
    downloadUrl: `${STORAGE_BASE}/TEST1.xlsx`,
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
    downloadUrl: `${STORAGE_BASE}/MEDIO.xlsx`,
    featured: false,
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
    downloadUrl: `${STORAGE_BASE}/CARO.xlsx`,
    featured: true,
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

// === Nivel 3 · Consultoría financiera integral =============================
// Proceso por fases. La siguiente fase se activa solo cuando la anterior está
// completa.
const consultingPhases = [
  {
    tag: 'Fase 1',
    title: 'Diagnóstico financiero real',
    price: 'S/ 2,500',
    duration: '2 – 3 semanas',
    description:
      'Por primera vez, el dueño de la empresa entiende exactamente en qué situación financiera real está — no la que reporta SUNAT, sino la real.',
    items: [
      'Reconstrucción de EEFF gerenciales',
      'Brecha SUNAT vs. contabilidad real',
      'Mapa de deuda, costos y rentabilidad',
      'Diagnóstico ejecutivo PDF (10–15 págs)',
      'Reunión de presentación de hallazgos',
      'Recomendaciones de ruta para Fase 2',
    ],
    payment: '100% adelantado al iniciar',
  },
  {
    tag: 'Fase 2',
    title: 'Plan de saneamiento',
    price: 'S/ 2,500',
    duration: '4 – 6 semanas',
    description:
      'La empresa sale con una hoja de ruta clara, con estados financieros presentables y con argumentos reales para negociar con bancos y acreedores.',
    items: [
      'EEFF presentables a banco o fondo',
      'Plan de regularización tributaria',
      'Propuesta formal a acreedores',
      'Proyecciones post-saneamiento',
      'Estrategia de acceso a crédito',
      'Reunión de cierre y entrega total',
    ],
    payment: '50% al iniciar · 50% al entregar',
  },
]

// Fase 3 · CFO externo (retainer mensual, solo ex-clientes de fase 1 + 2)
const cfoTiers = [
  {
    name: 'Básico',
    price: 'S/ 2,000',
    sub: 'Monitoreo y alertas',
    features: [
      'Revisión EEFF mensual',
      'Dashboard de indicadores',
      '1 reunión mensual (60 min)',
      'Alertas por WhatsApp',
    ],
    featured: false,
  },
  {
    name: 'Estándar',
    price: 'S/ 3,000',
    sub: 'Gestión activa',
    features: [
      'Todo lo básico +',
      'Gestión relación bancaria',
      '2 reuniones al mes',
      'Revisión de contratos fin.',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    price: 'S/ 4,000',
    sub: 'CFO dedicado',
    features: [
      'Todo lo estándar +',
      'Acompañamiento a banco',
      'Análisis de inversiones',
      'Disponibilidad prioritaria',
    ],
    featured: false,
  },
]

const profileHighlights = [
  'Ex-BBVA Perú',
  'Ex-Interbank',
  'PUCP Ing. Industrial',
  'Head of Finance · Agroexportación',
  'Especialista LATAM',
  'Diplomado Corp. Finance · Pacífico',
  'Diplomado Agroexportación · SNI',
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
      'Inmediatamente después del pago recibes un enlace de descarga por WhatsApp o email con el archivo Excel, la guía PDF y, en FinanDirectivo, los archivos del dashboard web. La entrega es instantánea.',
  },
  {
    question: '¿El precio de 50% OFF es permanente?',
    answer:
      'No. Es una oferta de lanzamiento válida solo esta semana. El precio normal de FinanStart es S/98, FinanPro S/218 y FinanDirectivo S/358. Una vez terminada la oferta, el precio vuelve a su valor normal sin excepciones.',
  },
]

function renderComparisonValue(value: string, featured = false) {
  if (value === 'check') {
    return <span className="text-3xl font-bold text-emerald-400">✓</span>
  }

  if (value === 'dash') {
    return <span className="text-2xl text-zinc-500">-</span>
  }

  return (
    <span
      className={[
        'text-lg font-extrabold sm:text-2xl',
        featured ? 'text-emerald-400' : 'text-amber-300',
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
}: {
  label: string
  time: RemainingTime
  cellClassName: string
}) {
  const units: { value: number; label: string }[] = [
    { value: time.days, label: 'Días' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ]

  return (
    <>
      <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-amber-200/90 uppercase">
        {label}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div key={unit.label} className={cellClassName}>
            <p className="text-2xl font-bold text-amber-300 tabular-nums sm:text-4xl">
              {pad(unit.value)}
            </p>
            <p className="text-[11px] tracking-[0.16em] text-zinc-300 uppercase">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

function App() {
  const [targetDate] = useState(getOfferDeadline)
  const [remainingTime, setRemainingTime] = useState<RemainingTime>(() =>
    getRemainingTime(targetDate),
  )
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0)
  useInView()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(getRemainingTime(targetDate))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  return (
    <div className="relative min-h-screen bg-[#0F2A22] text-[#FFFFFF]">

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <p className="text-sm tracking-[0.18em] text-amber-300/95 sm:text-base">
          <span className="font-semibold">DAVID BRITO</span>
          <span className="text-zinc-300"> · AI FINANCE</span>
        </p>

        <nav className="hidden items-center gap-8 lg:flex">
          {[
            { label: 'Plantillas', target: 'pricing' },
            { label: 'Servicios', target: 'servicios' },
            { label: 'Consultoría', target: 'consultoria' },
          ].map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() =>
                document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm font-medium text-zinc-300 transition hover:text-amber-300"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Button
          className="h-10 rounded-xl border border-amber-200/35 bg-amber-300 px-4 text-sm font-semibold text-emerald-950 transition hover:bg-amber-200"
          size="lg"
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver Plantillas
        </Button>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-7xl items-center justify-center px-5 pb-14 pt-6 sm:px-8 sm:pb-20">
          <div className="w-full max-w-4xl text-center">
          <p className="reveal mx-auto inline-flex items-center rounded-full border border-amber-300/40 bg-amber-200/8 px-4 py-2 text-xs font-semibold tracking-[0.15em] text-amber-200/95 sm:text-sm">
            Oferta de lanzamiento · 50% OFF
          </p>

          <h1 className="reveal reveal-delay-1 mt-8 font-display text-[2.35rem] leading-tight tracking-tight text-[#FFFFFF] sm:text-[4rem] sm:leading-[0.95] md:text-[5.4rem]">
            Las herramientas financieras que usan
            <span className="mt-2 block text-amber-300">las grandes empresas</span>
            <span className="mt-2 block">ahora en la tuya</span>
          </h1>

          <p className="reveal reveal-delay-2 mx-auto mt-8 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-xl">
            Plantillas profesionales para que empresarios peruanos entiendan sus
            números, controlen su negocio y lleguen al banco con datos que
            impresionan.
          </p>

          <div className="reveal reveal-delay-3 mx-auto mt-10 max-w-xl rounded-2xl border border-emerald-300/15 bg-black/20 p-4 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.8)]">
            <Countdown
              label="La oferta termina en"
              time={remainingTime}
              cellClassName="rounded-xl border border-emerald-200/15 bg-[#122b23] p-2 sm:p-3"
            />
          </div>

          <p className="reveal reveal-delay-4 mx-auto mt-4 inline-flex rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
            Descuento del 50% · Solo esta semana · El precio sube pronto
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              className="h-12 rounded-xl bg-amber-300 px-8 text-base font-semibold text-emerald-950 hover:bg-amber-200"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quiero la oferta
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-zinc-300/25 bg-transparent px-8 text-base text-zinc-100 hover:bg-zinc-100/10"
              onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola David, quisiera ver un demo de las plantillas')}`, '_blank', 'noopener,noreferrer')}
            >
              Ver demo de plantillas
            </Button>
          </div>
          </div>
        </section>

        <section className="border-y border-emerald-200/10 bg-black/15">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-4 sm:px-8">
            {credibilityItems.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={['reveal flex items-center gap-3 text-center text-sm text-zinc-300 sm:text-left', `reveal-delay-${Math.min(i + 1, 5)}`].join(' ')}>
                <Icon className="size-4 shrink-0 text-zinc-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="reveal reveal--left rounded-[2rem] border border-transparent p-0 lg:pr-6">
              <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
                El problema
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
                ¿Te identificas con alguna de estas situaciones?
              </h2>

              <div className="mt-8 divide-y divide-emerald-200/10 rounded-[1.75rem] border border-emerald-200/10 bg-black/8">
                {painPoints.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 px-4 py-5 text-left text-base text-zinc-200 sm:px-6 sm:text-[1.05rem]"
                  >
                    <div
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-300/12 text-lg ring-1 ring-amber-300/15"
                    >
                      {index === 0 && '😵'}
                      {index === 1 && '📄'}
                      {index === 2 && '🏦'}
                      {index === 3 && '🤷'}
                      {index === 4 && '📉'}
                    </div>
                    <p className="leading-relaxed text-zinc-200/95">{item}</p>
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
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Elige tu plantilla
            </p>
            <h2 className="mx-auto mt-5 max-w-5xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl lg:text-6xl">
              Tres niveles.
              <span className="text-amber-300"> Una sola decisión.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3 xl:gap-5">
            {plans.map((plan, i) => (
              <article
                key={plan.name}
                className={[
                  `reveal reveal--scale reveal-delay-${i + 1} relative flex h-full flex-col rounded-[2rem] border p-7 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.95)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_110px_-50px_rgba(0,0,0,0.95)] sm:p-8`,
                  plan.featured
                    ? 'border-amber-300/50 bg-[linear-gradient(180deg,rgba(30,78,58,0.95),rgba(9,38,31,0.98))] ring-1 ring-amber-300/30 xl:scale-[1.04]'
                    : 'border-emerald-200/15 bg-[linear-gradient(180deg,rgba(24,68,52,0.92),rgba(10,34,28,0.96))] hover:border-emerald-200/30',
                ].join(' ')}
              >
                {plan.featured ? (
                  <div className="absolute right-4 top-0 -translate-y-1/2 rounded-b-xl rounded-t-md bg-amber-300 px-4 py-2 text-xs font-black tracking-[0.12em] text-emerald-950 uppercase shadow-lg">
                    Más vendido
                  </div>
                ) : null}

                <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
                  {plan.level}
                </p>

                <h3 className="mt-5 font-display text-4xl text-[#FFFFFF] sm:text-[2.8rem]">
                  {plan.name}
                </h3>

                <p className="mt-2 text-lg font-medium italic text-zinc-300/90">
                  {`"${plan.tagline}"`}
                </p>
                <p className="text-lg text-zinc-300/75">{plan.description}</p>

                <div className="mt-8">
                  <p className="text-2xl text-zinc-400/85 line-through">
                    Precio normal: {plan.regularPrice}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="font-sans text-5xl font-black tracking-tight text-amber-300 sm:text-6xl">
                      {plan.offerPrice}
                    </p>
                    <span className="rounded-lg border border-red-400/20 bg-red-500/15 px-3 py-2 text-xs font-black tracking-[0.14em] text-red-300 uppercase">
                      50% off
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-emerald-200/10 pt-6">
                  <p className="text-sm font-extrabold tracking-[0.06em] text-amber-300 uppercase sm:text-base">
                    {plan.audience}
                  </p>
                </div>

                <ul className="mt-6 space-y-0.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border-b border-emerald-200/8 py-3 text-base leading-relaxed text-zinc-200/95 sm:text-[1.05rem]"
                    >
                      <Check className="mt-1 size-4 shrink-0 text-amber-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm font-bold leading-relaxed text-emerald-300 sm:text-base">
                  {plan.bonus}
                </div>

                <a
                  href={plan.downloadUrl}
                  download
                  className="mt-6 flex flex-1 items-end"
                >
                  <Button
                    className={[
                      'h-14 w-full rounded-2xl border-2 px-6 text-base font-black tracking-[0.02em] sm:text-lg',
                      plan.featured
                        ? 'border-amber-200/30 bg-amber-300 text-emerald-950 hover:bg-amber-200'
                        : 'border-amber-300/45 bg-transparent text-amber-300 hover:bg-amber-300/10',
                    ].join(' ')}
                  >
                    {plan.cta} {'->'}
                  </Button>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Compara
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              ¿Cuál es la
              <span className="text-amber-300"> diferencia?</span>
            </h2>
          </div>

          <div className="reveal reveal-delay-1 mt-10 overflow-hidden rounded-[2rem] border border-emerald-200/12 bg-[linear-gradient(180deg,rgba(19,59,46,0.94),rgba(8,31,25,0.98))] shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)]">
            <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] border-b border-emerald-200/10 bg-white/4 md:grid">
              <div className="px-5 py-5 text-left text-lg font-black tracking-[0.05em] text-amber-300 uppercase">
                Función
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-amber-300 uppercase">FinanStart</p>
                <p className="text-lg font-bold text-amber-300/90">S/49</p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-amber-300 uppercase">FinanPro</p>
                <p className="text-lg font-bold text-amber-300/90">S/109</p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-lg font-black text-amber-300 uppercase">FinanDirectivo</p>
                <p className="text-lg font-bold text-amber-300/90">S/179</p>
              </div>
            </div>

            <div className="divide-y divide-emerald-200/8">
              {comparisonRows.map((row) => (
                <div key={row.feature}>
                  <div className="px-5 py-4 text-left md:hidden">
                    <p className="text-base font-bold text-[#FFFFFF]">{row.feature}</p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-emerald-200/8 bg-black/10 p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-zinc-400 uppercase">
                          Start
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[0])}</div>
                      </div>
                      <div className="rounded-xl border border-emerald-200/8 bg-black/10 p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-zinc-400 uppercase">
                          Pro
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[1])}</div>
                      </div>
                      <div className="rounded-xl border border-emerald-200/8 bg-black/10 p-3 text-center">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-zinc-400 uppercase">
                          Directivo
                        </p>
                        <div className="mt-2">{renderComparisonValue(row.values[2], true)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] items-center md:grid">
                    <div className="px-5 py-5 text-left text-xl font-semibold text-[#FFFFFF]">
                      {row.feature}
                    </div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[0])}</div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[1])}</div>
                    <div className="px-4 py-5 text-center">{renderComparisonValue(row.values[2], true)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NIVEL 2 · Servicios puntuales ── */}
        <section id="servicios" className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Nivel 2 · Servicios puntuales
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              ¿Necesitas algo
              <span className="text-amber-300"> a la medida?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Entregables concretos para necesidades específicas. Pago al 100% por
              adelantado. Resultado en 7 días o menos.
            </p>
            <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-amber-200 uppercase">
              <Sparkles className="size-4" /> 20% OFF de lanzamiento en todos los servicios de Nivel 2
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
            {puntualServices.map((service, i) => {
              const Icon = service.icon
              return (
                <article
                  key={service.code}
                  className={[
                    `reveal reveal--scale reveal-delay-${i + 1} relative flex h-full flex-col rounded-[2rem] border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(24,68,52,0.92),rgba(10,34,28,0.96))] p-7 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.95)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200/30 hover:shadow-[0_40px_110px_-50px_rgba(0,0,0,0.95)] sm:p-8`,
                  ].join(' ')}
                >
                  <div className="absolute right-5 top-6 rounded-full border border-amber-300/25 bg-amber-300/12 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-amber-200 uppercase">
                    {service.badge}
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
                    <Icon className="size-6 text-amber-300" />
                  </div>

                  <p className="mt-5 text-xs font-bold tracking-[0.18em] text-amber-300/60 uppercase">
                    {service.code}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-[#FFFFFF]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-zinc-300/80">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-0.5">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 border-b border-emerald-200/8 py-3 text-base leading-relaxed text-zinc-200/95"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-amber-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 inline-flex items-center gap-2 self-start rounded-xl border border-amber-300/20 bg-amber-300/8 px-3 py-2 text-sm font-semibold text-amber-200">
                    <Sparkles className="size-4" /> Incluye reporte Sentinel gratis
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-amber-200/15 pt-6">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-amber-300/50 uppercase">
                        Inversión total
                      </p>
                      <p className="text-base text-zinc-400/80 line-through">
                        {service.regularPrice}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-sans text-3xl font-black tracking-tight text-amber-300">
                          {service.price}
                        </p>
                        <span className="rounded-md bg-amber-300 px-2 py-0.5 text-[10px] font-black tracking-[0.06em] text-emerald-950">
                          -20%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-[0.12em] text-zinc-400 uppercase">
                        Entrega
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-200">
                        <Clock className="size-3.5 text-amber-300" />
                        {service.delivery}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-1 items-end">
                    <a
                      href={waLink(
                        `Hola David, me interesa el servicio "${service.title}" (${service.code}). ¿Podemos conversar?`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full"
                    >
                      <Button className="h-13 w-full rounded-2xl border-2 border-amber-300/45 bg-transparent px-6 text-base font-black tracking-[0.02em] text-amber-300 hover:bg-amber-300/10">
                        Solicitar este servicio
                        <ArrowRight className="size-4" />
                      </Button>
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── NIVEL 3 · Consultoría financiera integral ── */}
        <section id="consultoria" className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Nivel 3 · Consultoría integral
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              Cuando el problema
              <span className="text-amber-300"> es sistémico</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Un proceso estructurado en fases para empresas con complejidad
              financiera real. Cada fase tiene valor independiente — y la siguiente
              se activa solo cuando la anterior está completa.
            </p>
          </div>

          <div className="reveal reveal-delay-1 mx-auto mt-10 flex max-w-4xl items-start gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/6 px-6 py-5 text-left">
            <span aria-hidden="true" className="text-2xl">⚠</span>
            <p className="text-base leading-relaxed text-zinc-300">
              Este servicio es para empresas con deuda acumulada, contabilidad mixta
              o que han intentado acceder a crédito y fueron rechazadas.{' '}
              <strong className="text-amber-300">
                No se puede pasar a la Fase 2 sin completar la Fase 1.
              </strong>
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {consultingPhases.map((phase, i) => (
              <article
                key={phase.tag}
                className={`reveal reveal-delay-${i + 1} relative overflow-hidden rounded-[2rem] border border-emerald-200/12 bg-[linear-gradient(180deg,rgba(19,59,46,0.94),rgba(8,31,25,0.98))] p-7 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)] sm:p-10`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300" />
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
                      {phase.tag}
                    </p>
                    <h3 className="mt-2 font-display text-3xl leading-tight text-[#FFFFFF]">
                      {phase.title}
                    </h3>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="font-sans text-4xl font-black tracking-tight text-amber-300">
                      {phase.price}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{phase.duration}</p>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300/85">
                  {phase.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {phase.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-amber-300/10 bg-amber-300/5 px-4 py-3 text-base text-zinc-200/90"
                    >
                      <Check className="size-4 shrink-0 text-amber-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/8 px-4 py-2.5 text-sm font-semibold text-amber-200">
                  <CreditCard className="size-4" />
                  {phase.payment}
                </div>
              </article>
            ))}

            {/* Fase 3 · CFO externo */}
            <article className="reveal reveal-delay-3 overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[linear-gradient(135deg,rgba(13,43,35,0.97),rgba(8,31,25,0.98))] p-7 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)] sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
                    Fase 3 · CFO Externo
                  </p>
                  <h3 className="mt-2 font-display text-3xl leading-tight text-[#FFFFFF]">
                    Acompañamiento estratégico mensual
                  </h3>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="font-sans text-3xl font-black tracking-tight text-amber-300">
                    S/ 2,000 – 4,000
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    por mes · solo ex-clientes fase 1 + 2
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300/85">
                Una vez que la empresa está sana, tiene sentido tener un especialista
                que la conoce por dentro revisando sus indicadores cada mes y
                gestionando su relación bancaria.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {cfoTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={[
                      'rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1',
                      tier.featured
                        ? 'border-amber-300/40 bg-amber-300/8'
                        : 'border-emerald-200/12 bg-black/15 hover:border-emerald-200/25',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold tracking-[0.16em] text-amber-300/70 uppercase">
                        {tier.name}
                      </p>
                      {tier.featured ? (
                        <span className="rounded-md bg-amber-300 px-2 py-0.5 text-[9px] font-black tracking-[0.08em] text-emerald-950 uppercase">
                          Recomendado
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 font-sans text-2xl font-black tracking-tight text-amber-300">
                      {tier.price}
                      <span className="text-sm font-medium text-zinc-400">/mes</span>
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{tier.sub}</p>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300/90"
                        >
                          <Check className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href={waLink(
                    'Hola David, me interesa la consultoría financiera integral (Nivel 3). ¿Podemos agendar una consulta?',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="h-13 rounded-2xl bg-amber-300 px-8 text-base font-black text-emerald-950 hover:bg-amber-200">
                    Agendar consulta de diagnóstico
                    <ArrowRight className="size-4" />
                  </Button>
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="reveal reveal--scale rounded-[2.25rem] border border-emerald-200/12 bg-[radial-gradient(circle_at_top,rgba(28,82,61,0.34),transparent_42%),linear-gradient(180deg,rgba(17,52,40,0.96),rgba(7,28,22,0.98))] px-6 py-12 text-center shadow-[0_35px_100px_-60px_rgba(0,0,0,0.95)] sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="mx-auto flex size-24 items-center justify-center rounded-full bg-amber-300 text-5xl shadow-[0_18px_40px_-15px_rgba(251,191,36,0.5)]"
            >
              👨
            </div>

            <h2 className="mt-8 font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              David Ricardo Brito Sánchez
            </h2>

            <p className="mt-4 text-sm font-black tracking-[0.08em] text-amber-300 uppercase sm:text-lg">
              Consultor financiero · David Brito AI Finance · VCONN SAC
            </p>

            <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-zinc-200/90 sm:text-2xl">
              Con experiencia en banca corporativa en BBVA Perú e Interbank,
              formación en Ingeniería Industrial en la PUCP y actual Head of
              Finance de una empresa agroexportadora, diseñé estas plantillas
              para que cualquier empresario en Latinoamérica tenga acceso a las
              mismas herramientas que usan las grandes empresas sin necesitar un
              equipo de finanzas.
            </p>

            <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-3">
              {profileHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-amber-300/22 bg-amber-300/6 px-5 py-3 text-sm font-bold text-amber-200 sm:text-base"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Preguntas frecuentes
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              Todo lo que necesitas
              <span className="text-amber-300"> saber</span>
            </h2>
          </div>

          <div className="reveal reveal-delay-1 mt-12 divide-y divide-amber-200/12 border-y border-amber-200/12">
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
                    <span className="text-xl font-bold text-[#FFFFFF] sm:text-2xl">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={[
                        'size-5 shrink-0 text-amber-300 transition-transform duration-200',
                        isOpen ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>

                  {isOpen ? (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-1 pb-4 pt-1 text-lg leading-relaxed text-zinc-300 sm:pb-6 sm:text-xl"
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
              <span className="text-amber-300">David Brito · AI Finance</span> · VCONN SAC · RUC 20611177977 · dr.britos79@gmail.com
            </p>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              © 2025 Todos los derechos reservados · Lima, Perú
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

export default App
