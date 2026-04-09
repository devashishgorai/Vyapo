"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LucideIcon, CreditCard, Package, BarChart3, Cloud, Settings, Headphones, MousePointer, TrendingUp, Shield } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Package,
  BarChart3,
  Cloud,
  Settings,
  Headphones,
  MousePointer,
  TrendingUp,
  Shield,
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const featureStyles: Record<string, { icon: string; hover: string; line: string; imageTone: string }> = {
  "POS Billing System": {
    icon: "from-[#0EA5E9] to-[#0369A1] shadow-[#0EA5E9]/25",
    hover: "from-[#0EA5E9]/18 to-[#0369A1]/8",
    line: "bg-[#0EA5E9]",
    imageTone: "",
  },
  "Inventory Management": {
    icon: "from-[#F97316] to-[#B45309] shadow-[#F97316]/25",
    hover: "from-[#F97316]/18 to-[#B45309]/8",
    line: "bg-[#F97316]",
    imageTone: "drop-shadow-[0_8px_14px_rgba(249,115,22,0.28)]",
  },
  "Sales Reports & Analytics": {
    icon: "from-[#06B6D4] to-[#2563EB] shadow-[#06B6D4]/25",
    hover: "from-[#06B6D4]/18 to-[#2563EB]/8",
    line: "bg-[#06B6D4]",
    imageTone: "drop-shadow-[0_8px_14px_rgba(6,182,212,0.28)]",
  },
  "Cloud-Based Access": {
    icon: "from-[#2563EB] to-[#1E40AF] shadow-[#2563EB]/25",
    hover: "from-[#2563EB]/18 to-[#1E40AF]/8",
    line: "bg-[#2563EB]",
    imageTone: "",
  },
  "Easy Restaurant Setup": {
    icon: "from-[#10B981] to-[#047857] shadow-[#10B981]/25",
    hover: "from-[#10B981]/18 to-[#047857]/8",
    line: "bg-[#10B981]",
    imageTone: "",
  },
};

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const isImageIcon = icon.startsWith("/");
  const IconComponent = iconMap[icon] || CreditCard;
  const style = featureStyles[title] || featureStyles["POS Billing System"];

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-xl shadow-[var(--shadow)] backdrop-blur-lg"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.hover} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className={`absolute inset-x-6 top-0 h-1 rounded-b-full ${style.line}`} />
      <div className="relative z-10">
        <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${style.icon} text-white shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:rotate-3`}>
          {isImageIcon ? (
            <Image src={icon} alt="" width={34} height={34} className={`h-8 w-8 object-contain ${style.imageTone}`} />
          ) : (
            <IconComponent size={28} strokeWidth={2.4} />
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--text)]">{title}</h3>
        <p className="text-[var(--text-muted)]">{description}</p>
      </div>
    </motion.div>
  );
}
