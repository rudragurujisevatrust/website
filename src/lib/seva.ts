import {
  GraduationCap,
  HeartPulse,
  type LucideIcon,
  Soup,
  Sprout,
  Wallet,
} from "lucide-react";

/** Keys into `dictionary.seva.items`. */
export type SevaKey =
  | "annadhanam"
  | "farming"
  | "medical"
  | "financial"
  | "education";

/**
 * Presentation only — every string a visitor reads comes from the dictionary.
 * The order here is the order the karyakramas appear on the page.
 */
export const sevaKaryakramas: {
  key: SevaKey;
  icon: LucideIcon;
  accent: string;
}[] = [
  { key: "annadhanam", icon: Soup, accent: "text-saffron-deep" },
  { key: "farming", icon: Sprout, accent: "text-green-700 dark:text-green-400" },
  { key: "medical", icon: HeartPulse, accent: "text-blue-700 dark:text-blue-400" },
  {
    key: "financial",
    icon: Wallet,
    accent: "text-purple-700 dark:text-purple-400",
  },
  {
    key: "education",
    icon: GraduationCap,
    accent: "text-indigo-700 dark:text-indigo-400",
  },
];
