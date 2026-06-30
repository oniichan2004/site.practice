import Link from "next/link";
import { ArrowUpRight, ChevronLeft,ChevronRight } from "lucide-react";
import CardCarRight from "../pages/home/card-car-right";
import { useTranslations } from "next-intl";
export default function PopularMakes() {
  const t = useTranslations("popularMakes");
  const c = useTranslations("common");
  return (
    <div className="">
      <div className="bg-black text-white w-full h-160 ">
        <div className="flex flex-row items-center justify-between  pt-20 pl-40 pr-40">
          <span className="text-3xl font-sans ">{t("title")}</span>
          <Link href="#" className="flex flex-row gap-1">
            {c("viewAll")} <ArrowUpRight size="20" />
          </Link>
        </div>

        <div className="pl-40 pr-40">
          <div className="flex flex-row pt-10 gap-5 pr-30 ">
            <span>Audi</span>
            <span>Ford</span>
            <span>Mercedes Benz</span>
          </div>
          <div className=" flex flex-row  items-center w-full pt-2 ">
            <div className="border-b border-white w-9  "></div>
            <div className=" border-b border-gray-700  w-full"></div>
          </div>
        </div>
        <div className="w-full pt-10 ">
          <CardCarRight />
        </div>
<div className="flex flex-row gap-4 pt-20 pl-40">
<div className = 'border w-13 rounded-full flex items-center justify-center hover:bg-gray-900'> <button> <ChevronLeft/></button></div>
<div className = 'border w-13 rounded-full flex items-center justify-center hover: bg-gray-900'><button> <ChevronRight/></button></div>


</div>

      </div>
    </div>
  );
}
