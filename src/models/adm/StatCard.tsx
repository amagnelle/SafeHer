import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "accent" | "success";
}

export function StatCard({
  icon,
  title,
  value,
  subtitle,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-900/10",
    accent: "border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-900/10",
    success: "border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-emerald-900/10",
  };

  return (
    <div
      className={`rounded-xl border p-6 backdrop-blur-sm transition-all hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 ${variantClasses[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-purple-300">{subtitle}</p>}
        </div>
        <div className="ml-4 text-2xl text-purple-400">{icon}</div>
      </div>
    </div>
  );
}
