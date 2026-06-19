"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "./language-context";

const languages = [
  { value: "en", label: "🇬🇧 English" },
  { value: "ro", label: "🇷🇴 Română" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  function handleChange(lang: string) {
    setLanguage(lang as "en" | "ro");
  }

  return (
    <Select value={language} onValueChange={handleChange}>
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
