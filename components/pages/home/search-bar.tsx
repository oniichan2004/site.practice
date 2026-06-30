import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
export default function SearchBar() {
  const t = useTranslations("search");
  return (
    <div  className=" dark:bg-black mt-6 flex h-17 w-full max-w-225 items-center rounded-full bg-white px-4 text-black shadow-lg text-sm md:text-base">
      <Select>
        <SelectTrigger className="h-12 w-60 border-0 bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder={t("anyMakes")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any-makes">{t("anyMakes")}</SelectItem>
          <SelectItem value="specific-make">{t("specificMake")}</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 w-px bg-gray-200"  />
      <Select>
        <SelectTrigger className="h-12 w-60 border-0 bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder={t("anyModels")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any-models">{t("anyModels")}</SelectItem>
          <SelectItem value="specific-model">{t("specificModel")}</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 w-px bg-gray-200"  />

      <div className="flex flex-row gap-5 px-4 ">
        <span className="text-gray-500"> {t("prices")} </span>
        <span className="text-gray-500 whitespace-nowrap"> {t("allPrices")} </span>
      </div>
      <Button variant="search" className="h-13">
        <Search />
        {t("searchCars")}
      </Button>
    </div>
  );
}
