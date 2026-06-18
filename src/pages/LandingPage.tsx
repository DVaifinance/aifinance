import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  FileText,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/useInView'
import { startDiagnosticoCheckout } from '@/lib/checkout'

const EMAIL = 'estrategia@dbaifinance.com'
const PHONE_DISPLAY = '+51 907 979 298'
const WA_NUMBER = '51907979298'

const heroStats = [
  { value: '7+', label: 'Años en banca corporativa' },
  { value: '$30M+', label: 'Cartera de activos gestionada' },
  { value: '143%', label: 'Crecimiento en colocaciones' },
]

// Resumen de las plantillas que viven en /servicios. Cada nivel se adapta al
// tamaño de la empresa y mantiene la oferta de lanzamiento del 50% OFF.
const planSummaries = [
  {
    level: 'Nivel 01',
    name: 'FinanStart',
    tagline: 'Tu primer control financiero',
    audience: 'Facturas hasta S/50k/año',
    regularPrice: 'S/98',
    offerPrice: 'S/49',
    highlights: [
      'Estado de Resultados automático',
      'Balance General básico',
      '5 indicadores con semáforo visual',
    ],
    featured: false,
  },
  {
    level: 'Nivel 02',
    name: 'FinanPro',
    tagline: 'Control y proyección en expansión',
    audience: 'Facturas S/50k – S/150k/año',
    regularPrice: 'S/218',
    offerPrice: 'S/109',
    highlights: [
      'Todo lo de FinanStart +',
      'Flujo de caja proyectado a 3 meses',
      '10 ratios + dashboard en Excel',
    ],
    featured: true,
  },
  {
    level: 'Nivel 03',
    name: 'FinanDirectivo',
    tagline: 'Finanzas de alta gerencia',
    audience: 'Facturas más de S/150k/año',
    regularPrice: 'S/358',
    offerPrice: 'S/179',
    highlights: [
      'Todo lo de FinanPro +',
      'Flujo operativo, inversión y financiamiento',
      'Dashboard web con URL pública',
    ],
    featured: false,
  },
]

// Nivel 2 · Servicios puntuales (resumen para el teaser → detalle en /servicios)
const puntualSummaries = [
  {
    icon: FileText,
    title: 'Plan de negocio integral',
    blurb: 'Documento profesional para presentarte ante socios, fondos o banca de desarrollo.',
    delivery: '7 días',
  },
  {
    icon: Landmark,
    title: 'Plan financiero bancario',
    blurb: 'Estructura tu información para acceder a crédito en las mejores condiciones.',
    delivery: '7 días',
  },
  {
    icon: Scale,
    title: 'Estructuración de deuda',
    blurb: 'Plan negociable ante acreedores y propuesta de refinanciamiento viable.',
    delivery: '1–3 sem.',
  },
]

const methodology = [
  {
    icon: Search,
    step: 'Paso 1',
    title: 'Diagnóstico',
    description:
      'Analizo su situación financiera actual: flujo de caja, estructura de deuda, rentabilidad por línea y oportunidades ocultas. Sin suposiciones — solo datos.',
  },
  {
    icon: Settings,
    step: 'Paso 2',
    title: 'Implementación',
    description:
      'Diseño y ejecuto la estrategia financiera: reestructuración de pasivos, negociación bancaria, modelos de proyección y automatización con IA.',
  },
  {
    icon: TrendingUp,
    step: 'Paso 3',
    title: 'Optimización',
    description:
      'Monitoreo continuo con dashboards automatizados, alertas de liquidez y reporting gerencial. Decisiones más rápidas, menos errores, más rentabilidad.',
  },
]

const experience = [
  {
    company: 'Empresa Agroexportadora Confidencial',
    period: '2025 – Presente',
    role: 'Jefe de Administración y Finanzas',
    achievement:
      'USD $535,400 en ventas adicionales de exportación con 11.2% de margen neto.',
  },
  {
    company: 'BBVA Perú',
    period: '2022',
    role: 'Funcionario de Negocios',
    achievement: 'Cartera de US$30M con crecimiento de +143% en colocaciones.',
  },
  {
    company: 'BBVA Perú',
    period: '2019 – 2022',
    role: 'Especialista Senior GTB – CIB',
    achievement:
      'Primera línea de factoring sostenible de TASA. Relación con grupos Brescia, Gloria y Dyer.',
  },
  {
    company: 'Interbank',
    period: '2018 – 2019',
    role: 'Analista Senior de Negocios',
    achievement: 'Incremento del 110% en ingresos de cartera.',
  },
]

const navItems = [
  { label: 'Servicios', target: 'servicios' },
  { label: 'Metodología', target: 'metodologia' },
  { label: 'Experiencia', target: 'experiencia' },
  { label: 'Contacto', target: 'contacto' },
]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function LandingPage() {
  useInView()

  useEffect(() => {
    document.title = 'David Brito · AI Finance — Asesoría Financiera Estratégica'
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0F2A22] text-[#FFFFFF]">
      <div className="bg-[#FAFAF7] text-[#0F2A22]">
        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="inline-flex items-center transition hover:opacity-80" aria-label="David Brito · AI Finance — Inicio">
            <img src="/logo-green.svg" alt="David Brito · AI Finance" className="h-9 w-auto sm:h-10" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => scrollToId(item.target)}
                className="text-sm font-medium text-emerald-900/70 transition hover:text-[#0F2A22]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            onClick={() => void startDiagnosticoCheckout()}
            className="h-10 rounded-xl bg-[#0F2A22] px-4 text-sm font-semibold text-white transition hover:bg-[#15392c]"
            size="lg"
          >
            Diagnóstico Financiero Express
          </Button>
        </header>

        {/* ── HERO ── */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-4 sm:px-8 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="reveal reveal--left">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-300/30 px-4 py-2 text-xs font-bold tracking-[0.14em] text-emerald-950 uppercase">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
              CFO Externo · IA Financiera
            </p>

            <h1 className="mt-7 font-display text-[3.5rem] font-bold leading-[0.92] tracking-tight text-[#0F2A22] sm:text-[5rem] lg:text-[5.5rem]">
              David
              <br />
              Brito
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-emerald-900/70 sm:text-xl">
              Asesoría Financiera Estratégica. Transformo datos en rentabilidad
              a través de Inteligencia Artificial y más de 7 años de experiencia
              en banca corporativa y finanzas.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => void startDiagnosticoCheckout()}
                className="h-12 w-full rounded-xl bg-[#0F2A22] px-7 text-base font-semibold text-white hover:bg-[#15392c] sm:w-auto"
              >
                Diagnóstico Financiero Express
              </Button>
              <Button
                className="h-12 w-full rounded-xl bg-zinc-200/80 px-7 text-base font-semibold text-[#0F2A22] hover:bg-zinc-200 sm:w-auto"
                onClick={() => scrollToId('servicios')}
              >
                Ver Servicios
              </Button>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-emerald-900/10 pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-sans text-3xl font-black tracking-tight text-amber-500 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-emerald-900/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal--right relative">
            <img
              src="/david-brito.jpg"
              alt="David Brito — Asesor Financiero Estratégico"
              className="aspect-[3/4] w-full rounded-[2rem] object-cover shadow-[0_40px_110px_-50px_rgba(15,42,34,0.45)]"
            />
          </div>
        </section>
      </div>

      <main className="relative z-10">

        {/* ── SERVICIOS · Resumen de plantillas (→ /servicios) ── */}
        <section id="servicios" className="bg-[#FAFAF7] text-[#0F2A22]">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="reveal text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                Plantillas financieras
              </p>
              <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
                Soluciones Financieras para
                <span className="text-amber-500"> Cada Etapa de su Empresa</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
                Plantillas profesionales por nivel, según cuánto factura tu
                empresa. Entiende tus números, proyecta tu flujo de caja y llega
                al banco con datos sólidos — sin depender de nadie.
              </p>

              <div className="mt-7 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/30 px-5 py-2.5 text-sm font-bold tracking-[0.02em] text-emerald-950">
                  <Sparkles className="size-4 text-amber-600" />
                  Oferta de lanzamiento · 50% OFF · solo esta semana
                </span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
              {planSummaries.map((plan, i) => (
                <Link
                  key={plan.name}
                  to="/servicios"
                  className={[
                    `reveal reveal--scale reveal-delay-${i + 1} group flex h-full flex-col rounded-[2rem] border bg-white p-7 shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-45px_rgba(15,42,34,0.4)] sm:p-8`,
                    plan.featured
                      ? 'border-amber-400/60 ring-2 ring-amber-300/40'
                      : 'border-emerald-900/10 hover:border-amber-300/40',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
                      {plan.level}
                    </p>
                    {plan.featured ? (
                      <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black tracking-[0.1em] text-emerald-950 uppercase">
                        Más cotizado
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 font-display text-3xl text-[#0F2A22]">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-base font-medium italic text-emerald-900/55">
                    {`"${plan.tagline}"`}
                  </p>

                  <div className="mt-5">
                    <p className="text-sm text-zinc-400 line-through">
                      Antes {plan.regularPrice}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="font-sans text-4xl font-black tracking-tight text-[#0F2A22]">
                        {plan.offerPrice}
                      </p>
                      <span className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-black tracking-[0.08em] text-red-600 uppercase">
                        50% off
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-bold tracking-[0.02em] text-amber-600">
                    {plan.audience}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-emerald-900/8 pt-5">
                    {plan.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-emerald-900/80"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 flex flex-1 items-end">
                    <span className="inline-flex items-center gap-1.5 text-sm font-black text-amber-600 transition-all group-hover:gap-3">
                      Ver más e indagar
                      <ArrowRight className="size-4" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="reveal mt-12 text-center">
              <Link to="/servicios" className="inline-flex">
                <Button className="h-14 rounded-2xl bg-[#0F2A22] px-8 text-base font-black text-white hover:bg-[#15392c]">
                  Ver todas las plantillas
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-emerald-900/55">
                Entrega inmediata · Compatible con Excel y Google Sheets · Soporte por WhatsApp
              </p>
            </div>

            {/* ── Nivel 2 · Servicios puntuales (resumen) ── */}
            <div className="mt-16 border-t border-emerald-900/10 pt-14">
              <div className="reveal text-center">
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                  Nivel 2 · Servicios puntuales
                </p>
                <h3 className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-[#0F2A22] sm:text-4xl">
                  ¿Necesitas algo
                  <span className="text-amber-500"> a la medida?</span>
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-emerald-900/65">
                  Si las plantillas no bastan, lo hacemos por ti: entregables
                  concretos, listos en 7 días o menos.
                </p>
              </div>

              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {puntualSummaries.map((service, i) => {
                  const Icon = service.icon
                  return (
                    <Link
                      to="/servicios"
                      key={service.title}
                      className={`reveal reveal-delay-${i + 1} group flex h-full flex-col rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-[0_20px_60px_-50px_rgba(15,42,34,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/40`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-300/15">
                          <Icon className="size-5 text-amber-600" />
                        </div>
                        <span className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-amber-700 uppercase">
                          {service.delivery}
                        </span>
                      </div>
                      <h4 className="mt-4 font-display text-lg leading-tight text-[#0F2A22]">
                        {service.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-emerald-900/65">
                        {service.blurb}
                      </p>
                      <span className="mt-4 flex flex-1 items-end">
                        <span className="inline-flex items-center gap-1.5 text-sm font-black text-amber-600 transition-all group-hover:gap-3">
                          Ver más
                          <ArrowRight className="size-4" />
                        </span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── METODOLOGÍA ── */}
        <section
          id="metodologia"
          className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="reveal text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
              Metodología
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-[#FFFFFF] sm:text-5xl">
              Mi Enfoque:
              <span className="text-amber-300"> Data, IA y Estrategia</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              No vendo tecnología. Entrego resultados: decisiones más rápidas,
              menos costos y alertas que previenen crisis de liquidez.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
            {methodology.map((phase, i) => {
              const Icon = phase.icon
              return (
                <article
                  key={phase.step}
                  className={`reveal reveal-delay-${i + 1} relative flex h-full flex-col rounded-[2rem] border border-emerald-200/12 bg-[linear-gradient(180deg,rgba(19,59,46,0.94),rgba(8,31,25,0.98))] p-8 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)]`}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-amber-400 text-emerald-950">
                    <Icon className="size-6" />
                  </div>
                  <p className="mt-6 text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
                    {phase.step}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-[#FFFFFF]">
                    {phase.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-zinc-300/85">
                    {phase.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── EXPERIENCIA ── */}
        <section id="experiencia" className="bg-[#FAFAF7] text-[#0F2A22]">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div className="reveal reveal--left">
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                  Experiencia
                </p>
                <h2 className="mt-5 font-display text-4xl leading-[1.05] text-[#0F2A22] sm:text-5xl">
                  Más de 7 Años en
                  <span className="block text-amber-500">Banca Corporativa</span>
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-emerald-900/65">
                  Ingeniero Industrial de la PUCP. Diplomado en Finanzas
                  Corporativas de Pacífico Business School.
                </p>

                <div className="mt-8 space-y-4">
                  {experience.map((job) => (
                    <article
                      key={`${job.company}-${job.period}`}
                      className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-[0_15px_45px_-32px_rgba(15,42,34,0.35)] sm:p-6"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                      <div className="pl-3">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-lg font-bold text-[#0F2A22]">
                            {job.company}
                          </span>
                          <span className="text-xs font-medium text-emerald-900/45">
                            {job.period}
                          </span>
                        </p>
                        <p className="mt-1 text-sm font-bold tracking-[0.01em] text-amber-600">
                          {job.role}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-emerald-900/65">
                          {job.achievement}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="reveal reveal--right">
                <img
                  src="/david-brito-2.jpg"
                  alt="David Brito — experiencia en banca corporativa"
                  className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_40px_110px_-50px_rgba(15,42,34,0.45)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <section id="contacto" className="bg-[#F2F2EF] text-[#0F2A22]">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="reveal text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
                Contacto
              </p>
              <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight text-[#0F2A22] sm:text-5xl">
                Iniciemos una
                <span className="text-amber-500"> Conversación</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-900/65">
                Cada empresa es diferente. Conversemos sobre su situación y
                encontremos la mejor estrategia financiera para su negocio.
              </p>
            </div>

            <div className="reveal reveal-delay-1 mx-auto mt-12 max-w-2xl rounded-[2rem] border border-emerald-900/8 bg-white p-8 shadow-[0_30px_80px_-55px_rgba(15,42,34,0.4)] sm:p-12">
              <div className="space-y-6">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-4 transition hover:opacity-80"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-emerald-950">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-900/50">Email</p>
                    <p className="break-all font-bold text-[#0F2A22]">{EMAIL}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 transition hover:opacity-80"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-emerald-950">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-900/50">Celular</p>
                    <p className="font-bold text-[#0F2A22]">{PHONE_DISPLAY}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-emerald-950">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-900/50">Cita presencial</p>
                    <p className="font-bold text-[#0F2A22]">Jesús María, Lima, Perú</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 border-t border-emerald-900/10 pt-8 text-center sm:flex-row sm:justify-center">
                <Button
                  onClick={() => void startDiagnosticoCheckout()}
                  className="h-13 w-full rounded-xl bg-[#0F2A22] px-8 text-base font-bold text-white hover:bg-[#15392c] sm:w-auto"
                >
                  Diagnóstico Financiero Express
                </Button>
                <a href={`mailto:${EMAIL}`} className="inline-flex w-full sm:w-auto">
                  <Button className="h-13 w-full rounded-xl border-2 border-[#0F2A22]/15 bg-transparent px-8 text-base font-bold text-[#0F2A22] hover:bg-[#0F2A22]/5 sm:w-auto">
                    Enviar Correo Ahora
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-emerald-900/10 bg-[#F2F2EF] px-5 py-10 text-center text-[#0F2A22] sm:px-8">
          <p className="text-sm tracking-[0.18em] sm:text-base">
            <span className="font-semibold text-[#0F2A22]">DAVID BRITO</span>
            <span className="text-emerald-900/55"> · AI FINANCE</span>
          </p>
          <p className="mt-2 text-sm text-emerald-900/55">CFO Externo · IA Financiera</p>
          <p className="mt-3 text-sm text-emerald-900/55">
            <Link to="/servicios" className="font-semibold text-amber-600 underline-offset-2 hover:underline">
              Plantillas financieras
            </Link>{' '}
            ·{' '}
            <a href="/politica-privacidad/index.html" className="font-semibold text-amber-600 underline-offset-2 hover:underline">
              Política de Privacidad
            </a>{' '}
            · VCONN SAC · {EMAIL}
          </p>
          <p className="mt-2 text-sm text-emerald-900/40">Lima, Perú · 2026</p>
        </footer>
      </main>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola David, me gustaría una asesoría financiera.')}`}
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

export default LandingPage
