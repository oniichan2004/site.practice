"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";

const languages = [
  { value: "en", label: "🇬🇧 English" },
  { value: "ro", label: "🇷🇴 Română" },
  { value: "ru", label: "🇷🇺 Русский" },
];

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(lang: string) {
    // Swap the locale segment in the URL while keeping the current path
    startTransition(() => {
      router.replace(pathname, { locale: lang });
    });
  }

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="h-9 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 gap-1 [&_svg]:text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
