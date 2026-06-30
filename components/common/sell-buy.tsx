import Link from "next/link";
// import {Button} from  "@/components/ui/button"
import { ArrowUpRight, Car, Van } from "lucide-react";
import { useTranslations } from "next-intl";
export default function SellBuy() {
  const t = useTranslations("sellBuy");
  const c = useTranslations("common");
  return (
    <div className=" bg-background rounded-b-[70px] relative z-10">
      <div className="pt-30 pl-50 flex flex-row gap-20 h-150 ">
        <div className="  pl-20 pt-15 pr-15 w-120 h-80 flex flex-col gap-3  bg-blue-100 dark:bg-blue-950 rounded-xl">
          <div className="text-2xl flex flex-col  font-bold font-sans ">
            <span> {t("lookingTitle1")}</span>
            <span>{t("lookingTitle2")}</span>
          </div>
          <div className="text-sm ">
            <span>
              {t("lookingDesc")}
            </span>
          </div>
          <div className="flex flex-row items-center  gap-34  text-white ">
            <div className="flex flex-row items-center justify-center bg-[#405FF2] w-33 h-15 rounded-xl ">
              <Link
                href="#"
                className="flex flex-row items-center justify-center "
              >
                {" "}
                {c("getStarted")} <ArrowUpRight size="20" />{" "}
              </Link>
            </div>
            <div className="">
              <Car size="90" className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="  pl-20 pt-15 pr-15 w-120 h-80 flex flex-col gap-3  bg-pink-100 dark:bg-pink-950 rounded-xl">
          <div className="text-2xl flex flex-col  font-bold font-sans ">
            <span>{t("sellTitle1")}</span>
            <span>{t("sellTitle2")}</span>
          </div>
          <div className="text-sm ">
            <span>
              {t("sellDesc")}
            </span>
          </div>
          <div className="flex flex-row items-center  gap-34 text-white  ">
            <div className="flex flex-row items-center justify-center bg-neutral-900 dark:bg-neutral-700 w-33 h-15 rounded-xl ">
              <Link
                href="#"
                className="flex flex-row items-center justify-center "
              >
                {" "}
                {c("getStarted")} <ArrowUpRight size="20" />{" "}
              </Link>
            </div>
            <div className="">
              <Van size="90" className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
