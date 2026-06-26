export interface ApplianceConfig {
  name: string;
  duration: number;
  icon: string;
  iconBg: string;
  description: string;
}

export const APPLIANCES_CONFIG: ApplianceConfig[] = [
  {
    name: "Lavadora",
    duration: 2,
    icon: "pi pi-cog",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
    description: "Ciclo estándar de lavado caliente",
  },
  {
    name: "Lavavajillas",
    duration: 2,
    icon: "pi pi-sync",
    iconBg: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20",
    description: "Ciclo eco de lavado diario",
  },
  {
    name: "Horno",
    duration: 1,
    icon: "pi pi-database",
    iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
    description: "Cocinado o asado a temperatura media",
  },
  {
    name: "Termo Eléctrico",
    duration: 3,
    icon: "pi pi-sliders-h",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20",
    description: "Calentamiento y acumulación de agua",
  },
  {
    name: "Aire Acondicionado",
    duration: 4,
    icon: "pi pi-sun",
    iconBg: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20",
    description: "Climatización continua de confort",
  },
];
