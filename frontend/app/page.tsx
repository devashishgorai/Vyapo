"use client";

import { useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Phone, Shield, BarChart3 } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import ThemeToggle from "@/components/ThemeToggle";
import { buildApiUrl, getApiBaseUrl } from "@/lib/api";
import { features, whyChoose, stats, testimonials } from "@/data/features";

const socialLinks = [
  { name: "Facebook", icon: "facebook", href: "#" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/vyapoindia" },
  { name: "LinkedIn", icon: "linkedin", href: "#" },
  { name: "X", icon: "x", href: "#" },
  { name: "YouTube", icon: "youtube", href: "#" },
] as const;

type SocialIconName = (typeof socialLinks)[number]["icon"];

type PreviewStyle = CSSProperties & {
  "--cursor-x": string;
  "--cursor-y": string;
  "--spotlight-opacity": string;
};

function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === "facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M14.5 8.1h2.1V4.6c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.3 1.9-5.3 5.5v3.1H4.7v3.9h3.4v6.7h4.2v-6.7h3.3l.5-3.9h-3.8v-2.7c0-1.1.3-2.2 2.2-2.2Z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.3" />
        <circle cx="16.6" cy="7.4" r="0.7" className="fill-current stroke-none" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M21 8.4c-.2-1.3-1.1-2.2-2.4-2.4C16.8 5.7 12 5.7 12 5.7s-4.8 0-6.6.3C4.1 6.2 3.2 7.1 3 8.4 2.7 10 2.7 12 2.7 12s0 2 .3 3.6c.2 1.3 1.1 2.2 2.4 2.4 1.8.3 6.6.3 6.6.3s4.8 0 6.6-.3c1.3-.2 2.2-1.1 2.4-2.4.3-1.6.3-3.6.3-3.6s0-2-.3-3.6Zm-10.8 6V9.6l4.6 2.4-4.6 2.4Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M6.7 8.6H3.2v11.1h3.5V8.6ZM5 7.1c1.1 0 2-.8 2-1.9s-.9-1.9-2-1.9-2 .8-2 1.9.9 1.9 2 1.9Zm15.8 6.6c0-3.4-1.8-5.4-4.7-5.4-1.6 0-2.8.8-3.3 1.7h-.1V8.6H9.4v11.1h3.5v-5.9c0-1.6.8-2.5 2.2-2.5 1.3 0 2.1.9 2.1 2.5v5.9h3.6v-6Z" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M14.5 10.2 22 2h-1.8l-6.5 7.1L8.5 2h-6l7.9 10.8L2.5 22h1.8l6.9-8 5.5 8h6l-8.2-11.8Zm-2.4 2.7-.8-1.1L4.9 3.4h2.7l5.1 6.8.8 1.1 6.8 9.2h-2.7l-5.5-7.6Z" />
      </svg>
    );
  }

  return null;
}

export default function Home() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [previewStyle, setPreviewStyle] = useState<PreviewStyle>({
    "--cursor-x": "50%",
    "--cursor-y": "50%",
    "--spotlight-opacity": "0",
    transform: "perspective(900px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)",
  });

  function handlePreviewMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 6;
    const tiltY = (x - 0.5) * 8;

    setPreviewStyle({
      "--cursor-x": `${x * 100}%`,
      "--cursor-y": `${y * 100}%`,
      "--spotlight-opacity": "1",
      transform: `perspective(900px) translateY(-8px) scale(1.02) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`,
    });
  }

  function handlePreviewLeave() {
    setPreviewStyle({
      "--cursor-x": "50%",
      "--cursor-y": "50%",
      "--spotlight-opacity": "0",
      transform: "perspective(900px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)",
    });
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormError("");

    const apiBaseUrl = getApiBaseUrl();

    if (!apiBaseUrl && process.env.NODE_ENV === "production") {
      setFormStatus("error");
      setFormError("Configure NEXT_PUBLIC_API_URL in Vercel so the contact form can reach your backend.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(buildApiUrl("/api/requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          location: formData.get("location"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Request submission failed");
      }

      form.reset();
      setFormStatus("success");
    } catch (error) {
      console.error(error);
      setFormError(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please make sure the backend is running and try again."
      );
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[var(--page-from)] via-[var(--page-via)] to-[var(--page-to)] text-[var(--text)] transition-colors duration-500">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--nav)] backdrop-blur-xl transition-colors duration-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-[180px] overflow-hidden rounded-3xl">
              <Image src="/vyapo-logo-final.png" alt="VYAPO logo" fill sizes="180px" className="object-contain" priority />
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-[var(--text-muted)] md:flex">
            <a href="#features" className="transition hover:text-[#F97316]">Products</a>
            <a href="#why" className="transition hover:text-[#F97316]">Use Cases</a>
            <a href="#testimonials" className="transition hover:text-[#F97316]">Clients</a>
            <a href="#contact" className="transition hover:text-[#F97316]">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-full bg-gradient-to-r from-[#B91C1C] via-[#EF4444] to-[#DC2626] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-red-500/25 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-red-500/40 md:inline-flex animate-[ctaPulse_2.4s_ease-in-out_infinite]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pt-14 pb-24">
          <div className="absolute right-0 top-24 h-72 w-72 -translate-x-1/3 rounded-full bg-[var(--glow-blue)] blur-3xl" />
          <div className="absolute left-0 top-40 h-96 w-96 -translate-y-1/2 rounded-full bg-[var(--glow-orange)] blur-3xl" />
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              className="relative isolate overflow-hidden rounded-[3.5rem] border border-white/10 bg-gradient-to-br from-[#1f2d46]/92 via-[#102645]/96 to-[#07111f] p-5 shadow-2xl shadow-black/35 backdrop-blur-xl md:p-8 lg:p-10"
            >
              <div className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-[#F97316]/15 blur-3xl" />
              <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-[#2A8DFF]/20 blur-3xl" />
              <div className="absolute inset-x-10 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div className="relative z-10">
                  <span className="mb-5 inline-flex rounded-full border border-[#F97316]/40 bg-[#F97316]/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-[#F97316]">
                    Smart POS Built for Growth
                  </span>
                  <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                    Your restaurant operations, organized beautifully.
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                    VYAPO brings billing, inventory, revenue tracking, KOT, and mobile counter operations into one clean POS workspace.
                  </p>
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <a
                      href="#contact"
                      className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#B91C1C] via-[#EF4444] to-[#DC2626] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-red-500/30 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-red-500/50 animate-[ctaPulse_2.4s_ease-in-out_infinite]"
                    >
                      Get Started
                      <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:border-[#F97316]/60 hover:bg-white/10"
                    >
                      Book Demo
                      <Play size={18} className="ml-2" />
                    </a>
                  </div>
                  <div className="mt-8 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                    <span className="rounded-2xl border border-white/10 bg-[#07111f]/80 px-4 py-3">
                      <strong className="block text-lg text-white">10+</strong>
                      Business customers
                    </span>
                    <span className="rounded-2xl border border-white/10 bg-[#07111f]/80 px-4 py-3">
                      <strong className="block text-lg text-white">99.9%</strong>
                      Uptime
                    </span>
                    <span className="rounded-2xl border border-white/10 bg-[#07111f]/80 px-4 py-3">
                      <strong className="block text-lg text-white">24/7</strong>
                      Support
                    </span>
                  </div>
                </div>

                <div className="relative min-w-0 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F97316]">Live POS Preview</p>
                      <h3 className="mt-2 text-2xl font-black text-white">Laptop screen with mobile counter view</h3>
                    </div>
                    <span className="rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#34d399]">
                      Connected
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-x-8 bottom-2 h-20 rounded-full bg-[#2A8DFF]/20 blur-2xl" />
                    <div
                      className="group relative z-10 mx-auto max-w-3xl overflow-hidden rounded-[8px] border border-white/15 bg-[#0b1220] p-2 shadow-2xl shadow-black/40 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-[#F97316]/50 hover:shadow-[#2A8DFF]/25"
                      onMouseMove={handlePreviewMove}
                      onMouseLeave={handlePreviewLeave}
                      style={previewStyle}
                    >
                      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_var(--cursor-x)_var(--cursor-y),rgba(255,255,255,0.34),rgba(255,255,255,0.1)_22%,transparent_48%)] opacity-[var(--spotlight-opacity)] transition-opacity duration-300" />
                      <Image
                        src="/vyagolap-preview.png"
                        alt="VYAPO POS laptop and mobile screen preview"
                        width={1536}
                        height={1024}
                        sizes="(min-width: 1024px) 680px, 100vw"
                        className="h-auto w-full rounded-[6px] object-cover transition duration-500 ease-out group-hover:scale-[1.01]"
                        priority
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                    {[
                      ["Floor tables", "Live status"],
                      ["KOT & billing", "One click"],
                      ["Mobile orders", "Synced"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                        <p className="mt-1 font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-center justify-between gap-4 text-sm uppercase tracking-[0.32em] text-[var(--text-soft)]">
              <span>Delivering POS Innovation</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">Built for restaurants & retail</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-[var(--shadow)]"
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="bg-[var(--surface)] px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#F97316]">Why Choose VYAPO</p>
              <h2 className="mt-4 text-4xl font-bold text-[var(--text)] md:text-5xl">Simplicity meets premium POS performance</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-muted)]">
                Trusted by growing businesses for clear reporting, fast onboarding, and secure cloud management.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {whyChoose.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-7 text-center shadow-lg shadow-[var(--shadow)]"
                >
                  <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#F97316] text-white">
                    {item.icon === "Headphones" && <Phone size={28} />}
                    {item.icon === "MousePointer" && <ArrowRight size={28} />}
                    {item.icon === "TrendingUp" && <BarChart3 size={28} />}
                    {item.icon === "Shield" && <Shield size={28} />}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-10 text-center shadow-lg shadow-[var(--shadow)]"
                >
                  <p className="text-5xl font-bold text-[#F97316]">{stat.value}</p>
                  <p className="mt-4 text-xl text-[var(--text-muted)]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-t-[3.5rem] border-t border-red-500/10 bg-[#fff7f7] px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-10 text-center">
              <span className="hidden h-px flex-1 bg-red-200 md:block" />
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f2937] md:text-lg">
                Trusted by <span className="text-[#DC2626]">real restaurant partners</span>
              </p>
              <span className="hidden h-px flex-1 bg-red-200 md:block" />
            </div>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {testimonials.map((client) => (
                <div
                  key={client.name}
                  className="partner-logo-card flex h-24 w-44 items-center justify-center rounded-3xl bg-white p-4 shadow-xl shadow-red-950/5 ring-1 ring-red-100"
                >
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={160}
                    height={90}
                    unoptimized
                    className="partner-logo-image max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="-mt-10 rounded-t-[4rem] bg-[#07111f] px-4 py-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mx-auto inline-flex rounded-full border border-white/40 px-8 py-3 text-sm font-black uppercase tracking-[0.24em] text-white/90">
                Why our clients love us
              </p>
              <h2 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                Real success stories from growing food businesses
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-md shadow-black/20">
                      <Image
                        src={testimonial.logo}
                        alt={`${testimonial.name} logo`}
                        fill
                        sizes="112px"
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300">&ldquo;{testimonial.content}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_0.8fr] items-start">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-10 shadow-lg shadow-[var(--shadow)]"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-[#F97316]">Contact</p>
                <h2 className="mt-4 text-4xl font-bold text-[var(--text)]">Let’s answer your questions.</h2>
                <p className="mt-5 text-lg text-[var(--text-muted)]">
                  Fill the form and our team will reach out to help you launch VYAPO for your business.
                </p>
                <div className="mt-10 space-y-5 text-[var(--text-muted)]">
                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>+91 7029214041</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image src="/gmail-icon.png" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                    <span>vyapoindia@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image src="/location-icon.png" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                    <span>Newtown, Kolkata – 700135</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg shadow-[var(--shadow)]"
              >
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-[var(--text-muted)]">Name</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                        className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--field)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-[var(--text-muted)]">Phone</span>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--field)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm text-[var(--text-muted)]">Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--field)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-[var(--text-muted)]">Location</span>
                    <input
                      name="location"
                      type="text"
                      placeholder="City or business location"
                      className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--field)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-[var(--text-muted)]">Message</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Tell us about your business needs..."
                      required
                      className="mt-2 w-full rounded-3xl border border-[var(--border)] bg-[var(--field)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20"
                    />
                  </label>
                  {formStatus === "success" && (
                    <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
                      Your request has been submitted successfully.
                    </p>
                  )}
                  {formStatus === "error" && (
                    <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
                      {formError || "We could not submit your request. Please make sure the backend is running and try again."}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full rounded-full bg-[#F97316] px-8 py-4 text-base font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {formStatus === "submitting" ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[#07111f] px-4 py-10 text-white transition-colors duration-500">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F97316]/20 to-transparent" />
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-[4rem] bg-[#F97316]/25 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#2A8DFF]/20 blur-3xl" />
        <div className="absolute left-1/2 top-10 h-40 w-[70vw] -translate-x-1/2 rounded-[3rem] bg-white/[0.03]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="relative mb-8 h-20 w-[250px] overflow-hidden rounded-[2rem] bg-white/5">
                  <Image src="/vyapo-logo-final.png" alt="VYAPO logo" fill sizes="250px" className="object-contain p-2" />
                </div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#F97316]">Smart POS Management</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
                  Let&apos;s answer your questions and launch your POS faster.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                  VYAPO helps restaurants, retail stores, and hospitality teams manage billing, inventory, analytics, and cloud operations from one simple platform.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="tel:+917029214041"
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:border-[#F97316]/60 hover:bg-white/[0.1]"
                >
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316] text-black">
                    <Phone size={20} />
                  </span>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Phone number</p>
                  <p className="mt-2 text-lg font-semibold text-white transition group-hover:text-[#F97316]">+91 7029214041</p>
                </a>

                <a
                  href="mailto:vyapoindia@gmail.com"
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:border-[#2A8DFF]/60 hover:bg-white/[0.1]"
                >
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A8DFF] text-white">
                    <Image src="/gmail-icon.png" alt="" width={28} height={28} className="h-7 w-7" />
                  </span>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Email</p>
                  <p className="mt-2 break-words text-lg font-semibold text-white transition group-hover:text-[#93C5FD]">vyapoindia@gmail.com</p>
                </a>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 sm:col-span-2">
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B1F3A]">
                    <Image src="/location-icon.png" alt="" width={28} height={28} className="h-7 w-7" />
                  </span>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">City</p>
                  <p className="mt-2 text-lg font-semibold text-white">Newtown, Kolkata – 700135</p>
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Connect with us</p>
                    <div className="mt-3 flex flex-wrap gap-3" aria-label="Social media links">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          aria-label={`Visit VYAPO on ${social.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#07111f]/70 text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#F97316] hover:bg-[#F97316] hover:text-black"
                        >
                          <SocialIcon icon={social.icon} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-[1fr_1.2fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">VYAPO</p>
                <p className="mt-2 text-sm text-slate-400">Premium POS software for billing, reporting, stock control, and support.</p>
              </div>

              <nav className="flex flex-wrap gap-3 text-sm text-slate-300 md:justify-self-center">
                <a href="#features" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#F97316] hover:text-[#F97316]">Features</a>
                <a href="#why" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#F97316] hover:text-[#F97316]">Why VYAPO</a>
                <a href="#testimonials" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#F97316] hover:text-[#F97316]">Clients</a>
                <a href="#contact" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#F97316] hover:text-[#F97316]">Contact</a>
              </nav>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-orange-400"
              >
                Book Demo
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© 2026 VYAPO. All rights reserved.</p>
              <p>Built for restaurants, retail and hospitality businesses.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
