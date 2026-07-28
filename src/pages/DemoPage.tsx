import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '@/hooks/useInView'
import { ArrowRight, Check, ChevronDown, MessageCircle, MessageCircleMore } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Página de aterrizaje del link en la biografía de Instagram: quien ve el reel
// llega aquí a ver el demo completo de las plantillas. Sin precios ni fechas de
// promoción a propósito — es una página perenne que no caduca.

const WA_NUMBER = '51907979298'

function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

// Demos publicados en YouTube (dominio nocookie: no deja cookies de seguimiento
// hasta que la persona le da play).
const FINANPRO_EMBED = 'https://www.youtube-nocookie.com/embed/JhU13p7SoQM'
const FINANDIRECTIVO_EMBED = 'https://www.youtube-nocookie.com/embed/0Z61Q0VUZM8'

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

const finanproHighlights = [
  'Registras tus ventas y gastos del día y el Estado de Resultados se arma solo.',
  'Comparas lo tuyo con lo que declara tu contador y la plantilla te avisa si algo no cuadra.',
  'Ratios con semáforo: ves en verde o en rojo dónde ganas y dónde se te va la plata.',
  'Incluye manual en PDF paso a paso, así que la usas desde el primer día.',
]

// Marco 16:9 con padding-top en vez de aspect-ratio: es lo más compatible con
// el navegador interno de Instagram, que es por donde llega la mayoría.
function VideoFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full bg-[#0b1e18]" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow={IFRAME_ALLOW}
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  )
}

function DemoPage() {
  const [showDirectivo, setShowDirectivo] = useState(false)
  useInView()

  useEffect(() => {
    document.title = 'Demo en video de las plantillas · David Brito AI Finance'
  }, [])

  return (
    <div className="relative min-h-screen bg-[#FAFAF7] text-[#0F2A22]">
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center transition hover:opacity-80"
          aria-label="David Brito · AI Finance — Inicio"
        >
          <img src="/logo-green.svg" alt="David Brito · AI Finance" className="h-9 w-auto sm:h-10" />
        </Link>

        <Link to="/servicios">
          <Button
            className="h-10 rounded-xl bg-[#0F2A22] px-4 text-sm font-semibold text-white transition hover:bg-[#15392c]"
            size="lg"
          >
            Ver planes
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-20 pt-2 sm:px-8 sm:pb-28 sm:pt-6">
        <p className="reveal text-xs font-semibold tracking-[0.22em] text-amber-600 uppercase">
          Demo en video
        </p>

        <h1 className="reveal reveal-delay-1 mt-4 font-display text-[2.35rem] leading-tight tracking-tight text-[#0F2A22] sm:text-5xl sm:leading-tight">
          Mira la plantilla
          <span className="text-amber-500"> en acción</span>
        </h1>

        <p className="reveal reveal-delay-2 mt-5 text-base leading-relaxed text-emerald-900/70 sm:text-xl">
          El demo completo: cómo saber{' '}
          <span className="font-semibold text-[#0F2A22]">cuánto gana de verdad tu negocio</span>, en
          5 minutos al día.
        </p>

        {/* ── Demo principal · FinanPro ── */}
        <section className="reveal reveal-delay-3 mt-9 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-emerald-900/8 px-5 py-4 sm:px-7">
            <h2 className="font-display text-2xl text-[#0F2A22]">FinanPro</h2>
            <p className="text-sm text-emerald-900/55">Caso real: un restaurante · 5:37 min</p>
          </div>

          <VideoFrame
            src={FINANPRO_EMBED}
            title="Demo de la plantilla FinanPro — caso real de un restaurante"
          />

          <ul className="px-5 py-5 sm:px-7 sm:py-6">
            {finanproHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-emerald-900/8 py-3 text-base leading-relaxed text-emerald-900/80 last:border-b-0 last:pb-0"
              >
                <Check className="mt-1 size-4 shrink-0 text-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CTAs principales ── */}
        <div className="reveal reveal-delay-4 mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href={waLink('Vi el demo y quiero mi plantilla')}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              className="h-14 w-full rounded-2xl bg-amber-400 px-5 text-base font-black text-emerald-950 hover:bg-amber-300"
            >
              <MessageCircleMore className="size-5" />
              Quiero mi plantilla
            </Button>
          </a>

          <Link to="/servicios" className="block">
            <Button
              className="h-14 w-full rounded-2xl border-2 border-[#0F2A22]/15 bg-transparent px-5 text-base font-black text-[#0F2A22] hover:bg-[#0F2A22]/5"
            >
              Ver planes y precios
              <ArrowRight className="size-4 shrink-0" />
            </Button>
          </Link>
        </div>

        <p className="reveal mt-4 text-center text-sm text-emerald-900/55">
          Te respondemos por WhatsApp y resolvemos tus dudas antes de que decidas.
        </p>

        {/* ── Demo secundario · FinanDirectivo (plegable) ── */}
        <section className="reveal mt-10 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_25px_70px_-50px_rgba(15,42,34,0.35)]">
          <button
            type="button"
            onClick={() => setShowDirectivo((open) => !open)}
            aria-expanded={showDirectivo}
            aria-controls="demo-finandirectivo"
            className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
          >
            <span className="flex-1">
              <span className="block text-lg font-bold text-[#0F2A22]">
                ¿Tu empresa es más grande?
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-emerald-900/60">
                Mira el demo de FinanDirectivo, pensado para equipos de más de 30 personas.
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={[
                'size-5 shrink-0 text-amber-600 transition-transform duration-200',
                showDirectivo ? 'rotate-180' : '',
              ].join(' ')}
            />
          </button>

          {showDirectivo ? (
            <div id="demo-finandirectivo" className="border-t border-emerald-900/8">
              <VideoFrame
                src={FINANDIRECTIVO_EMBED}
                title="Demo de la plantilla FinanDirectivo — caso real de una clínica"
              />

              <div className="px-5 py-5 sm:px-7 sm:py-6">
                <p className="text-base leading-relaxed text-emerald-900/75">
                  <span className="font-semibold text-[#0F2A22]">
                    Caso real: una clínica odontológica · 8:32 min.
                  </span>{' '}
                  Suma flujo de caja, escenarios, proyección a 12 meses y una{' '}
                  <span className="font-semibold text-[#0F2A22]">
                    presentación lista para el banco
                  </span>
                  .
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href={waLink('Vi el demo y me interesa FinanDirectivo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      className="h-13 w-full rounded-2xl bg-amber-400 px-5 text-sm font-black text-emerald-950 hover:bg-amber-300"
                    >
                      <MessageCircleMore className="size-4" />
                      Hablemos por WhatsApp
                    </Button>
                  </a>

                  <Link to="/servicios" className="block">
                    <Button
                      className="h-13 w-full rounded-2xl border-2 border-[#0F2A22]/15 bg-transparent px-5 text-sm font-black text-[#0F2A22] hover:bg-[#0F2A22]/5"
                    >
                      Ver planes y precios
                      <ArrowRight className="size-4 shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="border-t border-emerald-900/10 bg-[#F2F2EF] px-5 py-10 text-center text-[#0F2A22] sm:px-8">
        <p className="text-sm tracking-[0.18em] sm:text-base">
          <span className="font-semibold text-[#0F2A22]">DAVID BRITO</span>
          <span className="text-emerald-900/55"> · AI FINANCE</span>
        </p>
        <p className="mt-2 text-sm text-emerald-900/55">Claridad · Estrategia · Confianza</p>
        <p className="mt-3 text-sm text-emerald-900/55">
          <Link
            to="/servicios"
            className="font-semibold text-amber-600 underline-offset-2 hover:underline"
          >
            Plantillas financieras
          </Link>{' '}
          ·{' '}
          <a
            href="/politica-privacidad/index.html"
            className="font-semibold text-amber-600 underline-offset-2 hover:underline"
          >
            Política de Privacidad
          </a>{' '}
          · VCONN SAC · estrategia@dbaifinance.com
        </p>
        <p className="mt-2 text-sm text-emerald-900/40">Lima, Perú · 2026</p>
      </footer>

      <a
        href={waLink('Vi el demo y quiero mi plantilla')}
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

export default DemoPage
