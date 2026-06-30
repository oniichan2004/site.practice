'use client'

import Image from "next/image";
import { Play, Check, ArrowUpRight,BadgeDollarSign,BookCheck ,Gem ,Car  } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
// import { Button } from "../ui/button";
export default function Something() {
  const t = useTranslations("something");
  const c = useTranslations("common");
  return (
    <div className=" flex  flex-col items-center justify-center ">
      <div className="flex flex-row items-center bg-blue-100 dark:bg-blue-950 w-7xl h-140  rounded-2xl ">
        <div className="">
          <div className="relative w-160 h-140 flex  items-center justify-center  ">
            <Image
              src="/side-car.png"
              alt="car"
              fill
              className="object-cover rounded-l-2xl"
            />

            <Link href="#" className="absolute ">
              <div className=" flex items-center justify-center bg-white rounded-full size-13 ">
                <Play />
              </div>
            </Link>
          </div>
        </div>
        <div className="text-left pl-30 ">
          <div className="flex flex-col gap-3 ">
            <span className=" text-3xl font-sans font-bold">
              {t("offerTitle1")}
            </span>
            <span className=" text-3xl font-sans font-bold">
              {t("offerTitle2")}
            </span>
          </div>
          <div className="flex gap-3 pt-3">
            <span className="text-[15px] font-sans  ">
              {t("offerDesc")}
            </span>
          </div>
          <div className="flex flex-col  gap-3 pt-3 text-sans font-semibold">
            <div className="flex items-center gap-2  ">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  {t("point1")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  {t("point2")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  {t("point3")}
                </span>
              </div>
            </div>
          </div>

          <div className=" h-20 pt-6 flex flex-row">

            <button className="h-20 w-30 bg-blue-600 flex flex-row items-center justify-center rounded-xl"  onClick={() => window.scrollTo({top:0,behavior:'smooth'})}  >

              {c("getStarted")} <ArrowUpRight size='15' />{" "}
            </button>{" "}
          </div>
        </div>
      </div>
      <div className=" flex flex-row items-center justify-center w-300 h-40 gap-40 font-sans">
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 836M</span>
          <span className="text-[12px]"> {t("statCarsForSales")}</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 738M</span>
          <span className="text-[12px]"> {t("statDealerReviews")}</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 100M</span>
          <span className="text-[12px]"> {t("statVisitors")}</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 238M</span>
          <span className="text-[12px]"> {t("statVerifiedDealers")}</span>
        </div>
      </div>
      <div className="border bg-muted w-full h  "> </div>








      <div className="flex flex-col  w-300  h-90 pt-20">
        <div className="text-[30px] font-sans font-semibold">
          <span> {t("whyChooseUs")}</span>
        </div>
        <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2  w-70 text-sm pt-6">
          <div><BadgeDollarSign size = '35' className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>{t("feature1Title")}</span>
          </div>
          <div>
            <span>
              {t("feature1Desc")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><BookCheck  size = '35' className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>{t("feature2Title")}</span>
          </div>
          <div>
            <span>
              {t("feature2Desc")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><Gem size = '35' className="text-blue-400"/></div>
          <div className="text-[19px]">
            <span>{t("feature3Title")}</span>
          </div>
          <div>
            <span>
              {t("feature3Desc")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><Car size = '35'className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>{t("feature4Title")}</span>
          </div>
          <div>
            <span>
              {t("feature4Desc")}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
