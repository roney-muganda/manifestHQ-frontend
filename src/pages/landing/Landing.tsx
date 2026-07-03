import './landing.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Counter } from '@/components/ui/Counter';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { getReadableError } from '@/lib/errors';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Package,
  MessageSquare,
  Calculator,
  Shield,
  ChevronDown,
  Menu,
  X,
  Zap,
  BarChart3,
  Bell,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────

interface CalcResult {
  cif_value_kes: string;
  import_duty_rate_pct: string;
  import_duty_kes: string;
  excise_duty_rate_pct: string;
  excise_duty_kes: string;
  idf_levy_kes: string;
  rdl_levy_kes: string;
  vat_kes: string;
  kpa_handling_estimate_kes: string;
  total_landed_cost_kes: string;
  effective_total_rate_pct: string;
  disclaimer: string;
}

const CATEGORIES = [
  'Electronics & Phones',
  'Household Appliances',
  'Clothing & Textiles',
  'Footwear',
  'Computer Equipment',
  'Solar & Electrical Equipment',
  'Furniture',
  'Other',
];

// ── Utility: number formatting ────────────────────────────────

function fmt(v: string | number) {
  return `KES ${Number(v).toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// ── Sub-components ────────────────────────────────────────────

function NavBar({ menuOpen, setMenuOpen }: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-200
      ${scrolled
        ? 'bg-midnight/95 backdrop-blur-md border-b border-white/5 shadow-lg'
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shrink-0">
            <span className="text-midnight font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-white text-lg">ManifestHQ</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'For agents',   href: '#for-agents' },
            { label: 'Calculator',   href: '#calculator' },
            { label: 'Pricing',      href: '#pricing' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[#94A3B8] hover:text-white font-body transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#94A3B8] hover:text-white font-body transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="
              h-9 px-5 rounded-full text-sm font-semibold font-body
              bg-teal text-midnight hover:bg-teal-dark transition-colors
            "
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-midnight border-t border-white/10 px-5 py-4 space-y-4">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'For agents',   href: '#for-agents' },
            { label: 'Calculator',   href: '#calculator' },
            { label: 'Pricing',      href: '#pricing' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-[#94A3B8] hover:text-white font-body py-1"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <Link to="/login" className="text-sm font-semibold text-white font-body">
              Log in
            </Link>
            <Link
              to="/register"
              className="h-10 rounded-full text-sm font-semibold font-body bg-teal text-midnight flex items-center justify-center"
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative bg-midnight pt-32 pb-20 px-5 overflow-hidden">
      {/* Background drifting orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-teal/20 rounded-full blur-[120px] pointer-events-none animate-orb-one" />
      <div className="absolute bottom-10 right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none animate-orb-two" />

      {/* Background grid pan */}
      <div
        className="absolute inset-0 opacity-[0.04] animate-grid-pan"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                            linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow */}
      <div className="
        absolute top-0 left-1/2 -translate-x-1/2
        w-[600px] h-[300px]
        bg-teal/10 rounded-full blur-[120px]
        pointer-events-none animate-glow
      " />

      <div className="max-w-4xl mx-auto text-center relative reveal">
        {/* Pill */}
        <div className="
          inline-flex items-center gap-2 bg-white/5 border border-white/10
          rounded-full px-4 py-2 text-sm font-body text-[#94A3B8] mb-8
        ">
          <Zap className="w-3.5 h-3.5 text-teal" />
          Built for Kenyan clearing agents
        </div>

        <h1 className="
          font-display font-bold text-white leading-tight mb-6
          text-4xl sm:text-5xl lg:text-6xl
        ">
          Your clients deserve to know{' '}
          <span className="text-teal">where their goods are.</span>
        </h1>

        <p className="
          text-lg text-[#94A3B8] font-body leading-relaxed mb-10
          max-w-2xl mx-auto
        ">
          ManifestHQ gives clearing agents a professional dashboard to track
          shipments from Mombasa Port to Nairobi — with automated SMS updates
          to merchants at every stage. No more status calls. No more WhatsApp chaos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="
              h-12 px-8 rounded-full font-semibold font-body text-base
              bg-teal text-midnight hover:bg-teal-dark transition-colors
              flex items-center gap-2 w-full sm:w-auto justify-center
            "
          >
            Start free — 60 day trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#calculator"
            className="
              h-12 px-8 rounded-full font-semibold font-body text-sm
              border border-white/15 text-white hover:border-white/30
              transition-colors flex items-center gap-2 w-full sm:w-auto justify-center
            "
          >
            <Calculator className="w-4 h-4 text-teal" />
            Try the duty calculator
          </a>
        </div>

        {/* Trust strip */}
        <div className="
          flex items-center justify-center gap-6 mt-14 flex-wrap
        ">
          {[
            'No credit card required',
            'SMS sent in under 60 seconds',
            'Demurrage alerts built in',
          ].map((t, i) => (
            <div key={t} className={`flex items-center gap-2 text-sm text-[#64748B] font-body reveal reveal-delay-${i + 1}`}>
              <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="flex justify-center mt-16 reveal reveal-delay-4">
        <a href="#how-it-works" className="text-[#64748B] hover:text-white transition-colors">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

function ProblemStrip() {
  const problems = [
    {
      icon: MessageSquare,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      title: '"Where is my cargo?"',
      desc: <>Agents answer the same question <Counter end={20} duration={1500} />+ times a day via WhatsApp, phone, and text — while trying to do the actual clearance work.</>,
    },
    {
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      title: 'Surprise demurrage bills',
      desc: "Merchants don't know the free storage period is ending. By the time they find out, thousands of shillings in fees have already accrued.",
    },
    {
      icon: Shield,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      title: 'No way to verify agent costs',
      desc: "Merchants have no reference point for duty amounts. Rogue agents inflate charges because merchants cannot verify the real KRA rates.",
    },
  ];

  return (
    <section className="bg-[#0C1A2B] py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <p className="
          text-xs font-semibold font-body text-teal uppercase tracking-widest
          text-center mb-4 reveal
        ">
          The problem
        </p>
        <h2 className="
          font-display font-bold text-white text-3xl text-center mb-14 reveal reveal-delay-1
        ">
          Kenya's import clearance runs on WhatsApp.<br />
          <span className="text-[#64748B]">It doesn't have to.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`bg-white/5 border border-white/5 rounded-xl p-6 reveal reveal-delay-${i + 1}`}
              >
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">{p.title}</h3>
                <p className="text-sm text-[#64748B] font-body leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create a shipment',
      desc: "Add the container reference, port of entry, and your merchant's phone number. Takes under 2 minutes.",
    },
    {
      num: '02',
      title: 'Merchant gets a tracking link',
      desc: "An SMS is sent automatically with a secure link. No app to download, no account to create — just a tap.",
    },
    {
      num: '03',
      title: 'Update milestones with one tap',
      desc: "As goods move through clearance, tap to update the stage. All merchants are notified instantly via SMS.",
    },
    {
      num: '04',
      title: 'Demurrage alerts fire automatically',
      desc: "ManifestHQ tracks the free storage period and warns you and your clients before charges begin accruing.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-surface py-20 px-5 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold font-body text-teal uppercase tracking-widest text-center mb-4 reveal">
          How it works
        </p>
        <h2 className="font-display font-bold text-body text-3xl text-center mb-16 reveal reveal-delay-1">
          From container discharge to warehouse — tracked.
        </h2>

        <div className="relative">
          {/* SVG Animated Connector line — desktop only */}
          <svg className="hidden md:block absolute top-7 left-[10%] w-[80%] h-2 pointer-events-none" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="100%" y2="4" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="4" x2="100%" y2="4" stroke="#00b8a9" strokeWidth="2" className="cargo-path reveal" />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className={`flex flex-col items-center text-center reveal reveal-delay-${i + 1}`}>
                <div className="
                  w-14 h-14 rounded-full bg-midnight border border-border
                  flex items-center justify-center mb-4 relative z-10
                ">
                  <span className="font-data font-bold text-teal text-sm">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-body text-base mb-2">{step.title}</h3>
                <p className="text-sm text-slate font-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ForAgents() {
  const features = [
    {
      icon: Package,
      title: 'Five-stage milestone tracker',
      desc: 'Discharge → Documents → Inspection → Duties Paid → Nairobi Hub. One tap per stage. SMS fires to all merchants automatically.',
    },
    {
      icon: AlertTriangle,
      title: 'Demurrage countdown',
      desc: 'Every shipment shows the exact time remaining on the free storage period. Go amber 48 hours before. Go red when fees start.',
    },
    {
      icon: MessageSquare,
      title: 'Automated SMS to merchants',
      desc: 'Every milestone update triggers a plain-English SMS to every merchant on the shipment. No manual messages. No missed clients.',
    },
    {
      icon: Shield,
      title: 'Document vault per milestone',
      desc: 'Upload the Bill of Lading, PVoC, duty receipts, and gate pass at each stage. Permanent archive. No more digging through email.',
    },
    {
      icon: BarChart3,
      title: 'SMS delivery audit log',
      desc: 'See exactly which merchant received which message, at what time, and whether it was delivered. Full accountability.',
    },
    {
      icon: Bell,
      title: 'Daily morning summary',
      desc: 'A 7AM email showing every shipment in demurrage and every shipment with no update in 5+ days. Your day starts with clarity.',
    },
  ];

  return (
    <section id="for-agents" className="bg-white py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold font-body text-teal uppercase tracking-widest text-center mb-4 reveal">
          For clearing agents
        </p>
        <h2 className="font-display font-bold text-body text-3xl text-center mb-4 reveal reveal-delay-1">
          Everything you need. Nothing you don't.
        </h2>
        <p className="text-center text-slate font-body max-w-xl mx-auto mb-14 reveal reveal-delay-2">
          ManifestHQ is built around the actual workflow of a Kenyan clearing agent —
          not a generic logistics SaaS from a country with different problems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`bg-surface border border-border rounded-lg p-6 hover:border-teal/40 transition-colors reveal reveal-delay-${(i % 3) + 1}`}
              >
                <div className="w-9 h-9 rounded-lg bg-teal-pale flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-teal" />
                </div>
                <h3 className="font-display font-bold text-body text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate font-body leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MerchantSection() {
  return (
    <section className="bg-midnight py-20 px-5 overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="reveal">
          <p className="text-xs font-semibold font-body text-teal uppercase tracking-widest mb-4">
            For merchants
          </p>
          <h2 className="font-display font-bold text-white text-3xl mb-6">
            Your merchants track their goods without downloading anything.
          </h2>
          <p className="text-[#94A3B8] font-body leading-relaxed mb-8">
            When you add a merchant's phone number to a shipment, they receive
            an SMS with a secure tracking link. One tap opens a live status
            page — no account, no password, no app store. Works on any phone.
          </p>

          <div className="space-y-4">
            {[
              'SMS arrives instantly when shipment is created',
              'Link opens a mobile-first status page in the browser',
              'Each milestone update triggers a new SMS',
              'Link is valid for 7 days — agents can resend anytime',
              'Merchant sees only their own goods — never anyone else\'s',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <span className="text-sm text-[#94A3B8] font-body">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup with Animations */}
        <div className="flex justify-center relative reveal reveal-delay-2">
          
          {/* Floating SMS Notification Animation */}
          <div className="absolute -right-4 sm:-right-12 top-1/4 w-52 bg-white rounded-lg shadow-xl p-3 animate-sms-in z-20 opacity-0 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-teal rounded-sm flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-slate">ManifestHQ</span>
            </div>
            <p className="text-[11px] text-slate leading-tight">
              Update: Your shipment MSKU1234567 has arrived in Nairobi.
            </p>
          </div>

          <div className="w-64 bg-[#0C1A2B] rounded-[2rem] p-3 border border-white/10 shadow-2xl relative z-10">
            {/* Status bar */}
            <div className="flex justify-between items-center px-3 py-1.5 mb-2">
              <span className="text-[10px] font-data text-white/40">9:41</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="bg-midnight px-4 py-4 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal flex items-center justify-center">
                  <span className="text-midnight font-bold text-[9px]">M</span>
                </div>
                <span className="text-white font-display font-bold text-sm">ManifestHQ</span>
              </div>
              <p className="text-[11px] text-[#64748B] font-body mt-1">
                Hi Esther, here's your shipment.
              </p>
            </div>

            {/* Shipment card */}
            <div className="bg-card mx-0 px-4 py-4 rounded-b-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-pale flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-teal" />
                </div>
                <div>
                  <p className="font-data font-semibold text-xs text-body">MSKU1234567</p>
                  <p className="text-[10px] text-muted font-body">Electronics & Phones</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Cargo Discharged', done: true, time: '12 Jun · 08:14' },
                  { label: 'Documents Lodged', done: true, time: '12 Jun · 11:30' },
                  { label: 'Under Inspection', done: true, time: '13 Jun · 09:00' },
                  { label: 'Duties Paid',      done: true, time: '14 Jun · 14:20' }, // Changed to true to show pulse on next
                  { label: 'Arrived Nairobi',  done: false, time: null },
                ].map((stage, i) => (
                  <div key={stage.label} className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center">
                      {stage.done
                        ? <CheckCircle2 className="w-4 h-4 text-teal animate-check-pop" />
                        : <div className="relative w-4 h-4 rounded-full border-2 border-border bg-white flex items-center justify-center">
                            {/* The active stage pulse */}
                            {i === 4 && <div className="absolute inset-0 rounded-full border-2 border-teal animate-stage-pulse" />}
                          </div>
                      }
                      {i < 4 && (
                        <div className={`w-px h-4 ${stage.done ? 'bg-teal' : 'bg-border'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-semibold font-body leading-none mt-0.5 ${stage.done ? 'text-body' : 'text-muted'}`}>
                        {stage.label}
                      </p>
                      {stage.time && (
                        <p className="text-[10px] font-data text-muted mt-0.5">{stage.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmbeddedCalculator() {
  const [cifUsd, setCifUsd] = useState('');
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState<'sea' | 'air'>('sea');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function calculate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/calculator', {
        cif_usd: parseFloat(cifUsd),
        product_category: category,
        shipment_mode: mode,
      });
      setResult(data);
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="calculator" className="bg-surface py-20 px-5">
      <div className="max-w-3xl mx-auto reveal">
        <p className="text-xs font-semibold font-body text-teal uppercase tracking-widest text-center mb-4">
          Free tool
        </p>
        <h2 className="font-display font-bold text-body text-3xl text-center mb-4">
          KRA Import Duty Calculator
        </h2>
        <p className="text-center text-slate font-body max-w-xl mx-auto mb-10">
          Know your total landed cost before your goods arrive.
          Protect yourself from inflated agent charges.
          No account required.
        </p>

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-md">
          <form onSubmit={calculate} className="p-6 space-y-5">
            {/* CIF Input */}
            <div>
              <label className="text-sm font-semibold text-body font-body block mb-1.5">
                Declared goods value (CIF)
              </label>
              <div className="flex items-center border border-border rounded-md bg-white focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
                <span className="px-3 border-r border-border text-sm font-data font-semibold text-slate py-2.5">
                  USD $
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={cifUsd}
                  onChange={(e) => setCifUsd(e.target.value)}
                  placeholder="e.g. 2500"
                  className="flex-1 px-3 py-2.5 text-sm font-data text-body bg-transparent outline-none"
                />
              </div>
              <p className="text-xs text-muted font-body mt-1">
                Use the CIF (Cost, Insurance &amp; Freight) value from your invoice.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-body font-body block mb-1.5">
                Product category
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full h-10 px-3 text-sm font-body text-body
                  bg-white border border-border rounded-md
                  outline-none focus:border-teal
                "
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="text-sm font-semibold text-body font-body block mb-1.5">
                Shipment mode
              </label>
              <div className="flex gap-2">
                {(['sea', 'air'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`
                      flex-1 h-10 rounded-md text-sm font-semibold
                      font-body border transition-colors
                      ${mode === m
                        ? 'bg-midnight text-white border-midnight'
                        : 'bg-white text-slate border-border hover:border-border-strong'
                      }
                    `}
                  >
                    {m === 'sea' ? '🚢 Sea freight' : '✈️ Air freight'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !cifUsd || !category}
              className="
                w-full h-11 rounded-md font-semibold font-body
                text-sm bg-teal text-midnight hover:bg-teal-dark
                transition-colors disabled:opacity-50 disabled:pointer-events-none
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  Calculate landed cost
                </>
              )}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="border-t border-border animate-card-in">
              {/* Total */}
              <div className="bg-midnight px-6 py-5">
                <p className="text-xs text-[#64748B] font-body uppercase tracking-wide">
                  Total estimated landed cost
                </p>
                <p className="text-3xl font-data font-bold text-white mt-1">
                  {fmt(result.total_landed_cost_kes)}
                </p>
                <p className="text-xs text-[#64748B] font-body mt-1">
                  Effective rate: {Number(result.effective_total_rate_pct).toFixed(1)}% above invoice value
                </p>
              </div>

              {/* Breakdown */}
              <div className="divide-y divide-border">
                {[
                  {
                    label: 'CIF Value (KES equivalent)',
                    value: result.cif_value_kes,
                  },
                  {
                    label: `Import Duty (${result.import_duty_rate_pct}%)`,
                    value: result.import_duty_kes,
                  },
                  {
                    label: `Excise Duty (${result.excise_duty_rate_pct}%)`,
                    value: result.excise_duty_kes,
                    hide: Number(result.excise_duty_kes) === 0,
                  },
                  { label: 'IDF Levy (2.5%)',    value: result.idf_levy_kes },
                  { label: 'RDL Levy (2%)',      value: result.rdl_levy_kes },
                  { label: 'VAT (16%)',           value: result.vat_kes },
                  {
                    label: 'KPA Handling (estimate)',
                    value: result.kpa_handling_estimate_kes,
                  },
                ]
                  .filter((r) => !r.hide)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <span className="text-sm text-slate font-body">{row.label}</span>
                      <span className="text-sm font-data font-semibold text-body">
                        {fmt(row.value)}
                      </span>
                    </div>
                  ))}

                {/* Grand total row */}
                <div className="flex items-center justify-between px-6 py-4 bg-teal-pale">
                  <span className="text-sm font-semibold text-teal font-body">
                    Total Landed Cost
                  </span>
                  <span className="text-base font-data font-bold text-teal">
                    {fmt(result.total_landed_cost_kes)}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="px-6 py-4 bg-amber-50 border-t border-amber-100 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-body leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>

              {/* CTA */}
              <div className="px-6 py-5 bg-surface border-t border-border text-center">
                <p className="text-sm text-slate font-body mb-3">
                  Need your goods cleared? Find a verified ManifestHQ agent.
                </p>
                <Link
                  to="/register"
                  className="
                    inline-flex items-center gap-2 h-9 px-5 rounded-full
                    bg-midnight text-white text-sm font-semibold font-body
                    hover:bg-navy transition-colors
                  "
                >
                  I'm a clearing agent — get started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: 3500,
      description: 'Small agencies getting started with digital client management.',
      features: [
        'Up to 25 shipments/month',
        '500 SMS included/month',
        'Five-milestone tracker',
        'Demurrage countdown',
        'Merchant tracking portal',
        'Up to 50 merchant accounts',
      ],
      cta: 'Start free trial',
      highlight: false,
    },
    {
      name: 'Professional',
      price: 7500,
      description: 'Established agents who want to stand out from competitors.',
      features: [
        'Up to 100 shipments/month',
        '2,000 SMS included/month',
        'Everything in Starter',
        'Document vault per milestone',
        'Automated invoice generation',
        'WhatsApp Business updates',
        'Verified agent directory listing',
        'Up to 3 sub-users',
      ],
      cta: 'Start free trial',
      highlight: true,
    },
    {
      name: 'Business',
      price: 15000,
      description: 'Consolidators and high-volume agents managing large operations.',
      features: [
        'Unlimited shipments',
        '6,000 SMS included/month',
        'Everything in Professional',
        'LCL / groupage merchant views',
        'Port delay intelligence',
        'API access',
        'Monthly analytics report',
        'Up to 10 sub-users',
        'Priority support (4hr)',
      ],
      cta: 'Start free trial',
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold font-body text-teal uppercase tracking-widest text-center mb-4 reveal">
          Pricing
        </p>
        <h2 className="font-display font-bold text-body text-3xl text-center mb-4 reveal reveal-delay-1">
          Priced for Kenyan clearing agents.
        </h2>
        <p className="text-center text-slate font-body max-w-xl mx-auto mb-14 reveal reveal-delay-2">
          Every plan starts with a 60-day free trial. No credit card required.
          Cancel anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`
                rounded-xl p-6 flex flex-col reveal reveal-delay-${i + 1}
                ${tier.highlight
                  ? 'bg-midnight border-2 border-teal shadow-lg relative'
                  : 'bg-surface border border-border'
                }
              `}
            >
              {tier.highlight && (
                <div className="
                  absolute -top-3 left-1/2 -translate-x-1/2
                  bg-teal text-midnight text-xs font-bold font-body
                  px-4 py-1 rounded-full
                ">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <p className={`font-display font-bold text-lg mb-1 ${tier.highlight ? 'text-white' : 'text-body'}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`font-data font-bold text-3xl ${tier.highlight ? 'text-white' : 'text-body'}`}>
                    KES <Counter end={tier.price} duration={1500} />
                  </span>
                  <span className={`text-sm font-body ${tier.highlight ? 'text-[#64748B]' : 'text-muted'}`}>
                    /month
                  </span>
                </div>
                <p className={`text-sm font-body ${tier.highlight ? 'text-[#64748B]' : 'text-slate'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <span className={`text-sm font-body ${tier.highlight ? 'text-[#94A3B8]' : 'text-slate'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`
                  h-11 rounded-md font-semibold font-body text-sm
                  flex items-center justify-center transition-colors
                  ${tier.highlight
                    ? 'bg-teal text-midnight hover:bg-teal-dark'
                    : 'bg-midnight text-white hover:bg-navy'
                  }
                `}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-midnight py-20 px-5">
      <div className="max-w-3xl mx-auto text-center reveal">
        <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-6">
          Stop answering status calls.<br />
          <span className="text-teal">Let ManifestHQ answer them for you.</span>
        </h2>
        <p className="text-[#94A3B8] font-body text-lg mb-10 max-w-xl mx-auto">
          Set up your first shipment in under 5 minutes.
          Your first client SMS goes out before you finish your chai.
        </p>
        <Link
          to="/register"
          className="
            inline-flex items-center gap-2 h-12 px-10 rounded-full
            bg-teal text-midnight font-bold font-body text-base
            hover:bg-teal-dark transition-colors
          "
        >
          Start your free 60-day trial
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-sm text-[#475569] font-body mt-4">
          No credit card. No setup fee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#060F1A] px-5 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-midnight font-display font-bold text-xs">M</span>
              </div>
              <span className="font-display font-bold text-white">ManifestHQ</span>
            </div>
            <p className="text-sm text-[#475569] font-body max-w-xs">
              Kenya's import clearance visibility platform.
              Built by infraLabs, Nairobi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {[
              { label: 'Product', links: [
                { text: 'How it works', href: '#how-it-works' },
                { text: 'For agents',  href: '#for-agents' },
                { text: 'Pricing',     href: '#pricing' },
                { text: 'Calculator',  href: '#calculator' },
              ]},
              { label: 'Account', links: [
                { text: 'Log in',   href: '/login' },
                { text: 'Register', href: '/register' },
              ]},
            ].map((col) => (
              <div key={col.label}>
                <p className="text-xs font-semibold font-body text-[#475569] uppercase tracking-widest mb-3">
                  {col.label}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.text}>
                      {l.href.startsWith('#') ? (
                        <a href={l.href} className="text-sm text-[#64748B] hover:text-white font-body transition-colors">
                          {l.text}
                        </a>
                      ) : (
                        <Link to={l.href} className="text-sm text-[#64748B] hover:text-white font-body transition-colors">
                          {l.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#334155] font-body">
            © {new Date().getFullYear()} infraLabs. All rights reserved.
          </p>
          <p className="text-xs text-[#334155] font-body">
            Nairobi, Kenya · support@manifestHQ.co.ke
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  return (
    <div className="min-h-screen">
      <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <ProblemStrip />
      <HowItWorks />
      <ForAgents />
      <MerchantSection />
      <EmbeddedCalculator />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}