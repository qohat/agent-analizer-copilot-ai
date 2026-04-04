'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Smartphone, BarChart3, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md border-b border-emerald-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-mono font-bold text-lg tracking-tight text-emerald-400">
            COPILOTO
          </div>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition"
            >
              Ingresar
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-emerald-500 text-slate-950 text-sm font-semibold rounded-lg hover:bg-emerald-400 transition"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="text-emerald-400">Copiloto de IA</span>
            <br />
            para crédito en campo
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Captura solicitudes completas offline. Análisis instantáneo. Sincronización automática.
            Reduce ciclos de aprobación de semanas a días.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
            >
              Acceder a la app <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 border border-emerald-500/50 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 transition">
              Ver demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 py-24 border-t border-slate-800">
          <FeatureCard
            icon={<Smartphone className="w-8 h-8 text-emerald-400" />}
            title="Funciona sin internet"
            description="Captura completa en campo. Se sincroniza cuando hay conexión."
            delay={100}
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-emerald-400" />}
            title="Análisis instantáneo"
            description="IA valida capacidad de pago y riesgo en tiempo real."
            delay={200}
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-emerald-400" />}
            title="Ciclos más rápidos"
            description="Reduce rechazos por datos incompletos. Aprobaciones en horas."
            delay={300}
          />
        </div>

        {/* Value Prop */}
        <div className="py-24 grid md:grid-cols-2 gap-12 items-center border-t border-slate-800">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Diseñado para asesores rurales</h2>
            <ul className="space-y-3">
              {[
                'Formulario paso a paso (5 pasos)',
                'Validación en campo (no sorpresas)',
                'Análisis IA asistido (tú decides)',
                'Sincronización robusta',
                'Panel para comité de crédito',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
            <div className="space-y-4 font-mono text-sm text-emerald-400">
              <div>{`// 20-30% de rechazos por info incompleta`}</div>
              <div>{`// Ciclos de 2-3 semanas`}</div>
              <div>{`// 30% del tiempo en admin`}</div>
              <div className="text-slate-500 pt-4">↓</div>
              <div className="text-emerald-300 pt-4">{`// Solicitudes completas desde campo`}</div>
              <div className="text-emerald-300">{`// Ciclos de 2-3 días`}</div>
              <div className="text-emerald-300">{`// Más tiempo vendiendo`}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>© 2026 Copiloto de Crédito. Para asesores rurales de LATAM.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description, delay }: any) {
  return (
    <div
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4 hover:border-emerald-500/50 transition group"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms backwards`,
      }}
    >
      <div className="p-3 bg-slate-900 rounded-lg w-fit group-hover:bg-emerald-500/10 transition">
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
