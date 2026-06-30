import { Button } from "@/components/ui/button";
import { Apple, Guitar, Landmark, Piano, Play, University } from "lucide-react";
import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("footer");
  const b = useTranslations("bodyType");
  return (
    <div className="flex flex-col -mt-20   ">
      <div className="w-full h-160 bg-neutral-900  pl-50 pr-50 flex flex-col">
        <div className="flex flex-row items-center justify-between text-white border-b border-gray-800  pt-25  h-70 ">
          <div className="flex flex-col gap-3">
            <span className="text-3xl  font-sans"> {t("joinTitle")}</span>
            <span className="text-sm">
              {t("joinDesc")}
            </span>
          </div>
          <div className=" flex flex-row items-center  justify-between pr-1 pl-6 w-110 h-15   bg-gray-700 rounded-full">
            <input
              type="text"
              placeholder={t("emailPlaceholder")}
              className="outline-none flex-1"
            />
            <Button className="bg-blue-500 rounded-full w-30 h-13 ">
              {t("signUp")}
            </Button>
          </div>
        </div>

        <div className="pt-10 flex flex-row gap-30 text-sm">
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">{t("company")}</span>
            <span>{t("aboutUs")}</span>
            <span>{t("blog")}</span>
            <span>{t("services")}</span>
            <span>{t("faqs")}</span>
            <span>{t("terms")}</span>
            <span>{t("contactUs")}</span>
          </div>
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">{t("quickLinks")}</span>
            <span>{t("getInTouch")}</span>
            <span>{t("helpCenter")}</span>
            <span>{t("liveChat")}</span>
            <span>{t("howItWorks")}</span>
          </div>
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">{t("ourBrands")}</span>
            <span>Toyota</span>
            <span>Porsche</span>
            <span>Audi</span>
            <span>BMW</span>
            <span>Ford</span>
            <span>Nissan</span>
            <span>Peugeot</span>
            <span>Volkswagen</span>
          </div>
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">{t("vehiclesType")}</span>
            <span>{b("sedan")}</span>
            <span>{b("hatchback")}</span>
            <span>{b("suv")}</span>
            <span>{b("hybrid")}</span>
            <span>{b("electric")}</span>
            <span>{b("coupe")}</span>
            <span>{b("truck")}</span>
            <span>{b("convertible")}</span>
          </div>
          <div className="flex flex-col gap-3 text-white font-sans">
            <span className="text-2xl">{t("ourMobileApp")}</span>
            <div className=" flex flex-col gap-4">
              <button className="bg-gray-700 w-40 h-13 rounded-xl hover:bg-gray-500">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Apple />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[11px]">{t("downloadOn")} </span>
                    <span className="text-[17px]">{t("appleStore")}</span>
                  </div>
                </div>
              </button>
              <button className="bg-gray-700 w-40 h-13 rounded-xl hover:bg-gray-500">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Play />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[11px]">{t("getItOn")} </span>
                    <span className="text-[17px]"> {t("googlePlay")}</span>
                  </div>
                </div>
              </button>
            </div>
            <span className="text-2xl font-sans pt-4">{t("connectWithUs")}</span>

            <div className="flex flex-row gap-7">
              <Landmark size="15" />
              <University size="15" />
              <Piano size="15" />
              <Guitar size="15" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full h-20 bg-neutral-900 border-t border-gray-800 px-50 text-white">
        <span>{t("rights")}</span>
        <span> {t("legal")}</span>
      </div>
    </div>
  );
}
