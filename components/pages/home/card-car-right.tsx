import { Bookmark, Gauge, Fuel, Settings, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
export default function CardCarRight() {
  const c = useTranslations("common");
  return (
    <div className="pt-2 pl-40 flex flex-row gap-10 overflow-hidden">
      <div className=" shrink-0 flex flex-row  w-130 h-60 rounded-xl bg-gray-700">
        <div className="relative w-1/2 h-full">
          <Image
            src="/cars/audi-a5.png"
            alt="audi a5"
            fill
            className="rounded-l-xl"
          ></Image>
          <div className="absolute  top-2 left-3 right-3 flex flex-row items-center justify-between  p-3">
            <div className="bg-blue-600 rounded-full w-15 text-white flex  items-center justify-center">
              <span>{c("sale")}</span>
            </div>
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
              <Bookmark className="text-black" size={17} />
            </div>
          </div>
        </div>
        <div className="flex flex-col pl-7 pt-3 text-white ">
          <div className="flex flex-col gap-1">
            <span>Audi A5 - 2023</span>
            <span className="text-[11px]">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>

          <div className="flex flex-col pt-3 gap-2 text-[13px]">
            <div className="flex flex-row items-center gap-2 text-[13px]">
              <Gauge size={15} /> <span> 500 miles</span>{" "}
            </div>
            <div className="flex flex-row items-center gap-2">
              <Fuel size={15} /> <span> Petrol</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Settings size={15} /> <span> Automatic</span>
            </div>
          </div>

          <div className="pt-5">
            <span className="line-through">$ 50 000</span>
          </div>
          <div className="flex flex-row items-center justify-between gap-13 pb-10">
            <span className="text-xl">$45 000</span>
            <Link href="#" className="flex flex-row items-center ">
              <span>{c("viewDetails")}</span> <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>


      <div className=" shrink-0 flex flex-row  w-130 h-60 rounded-xl bg-gray-700">
        <div className="relative w-1/2 h-full">
          <Image
            src="/cars/audi-a4.png"
            alt="audi a5"
            fill
            className="rounded-l-xl"
          ></Image>
          <div className="absolute  top-2 left-3 right-3 flex flex-row items-center justify-between  p-3">
            <div className="bg-blue-600 rounded-full w-15 text-white flex  items-center justify-center">
              <span>{c("sale")}</span>
            </div>
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
              <Bookmark  className="text-black" size={17} />
            </div>
          </div>
        </div>
        <div className="flex flex-col pl-7 pt-3 text-white ">
          <div className="flex flex-col gap-1">
           
            <span>Audi A4 - 2022</span>
            <span className="text-[11px]">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>

          <div className="flex flex-col pt-3 gap-2 text-[13px]">
            <div className="flex flex-row items-center gap-2 text-[13px]">
             
              <Gauge size={15} /> <span>150 miles</span>{" "}
            </div>
            <div className="flex flex-row items-center gap-2">
           
              <Fuel size={15} /> <span> Diesel</span>
            </div>
            <div className="flex flex-row items-center gap-2">
             
              <Settings size={15} /> <span> CVT</span>
            </div>
          </div>

          

          <div className=" flex flex-row items-center justify-between gap-10 pt-10 ">
            <span className="text-xl">$120 000</span>
            <Link href="#" className="flex flex-row items-center ">
              <span>{c("viewDetails")}</span> <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

       <div className=" shrink-0  flex flex-row  w-130 h-60 rounded-xl bg-gray-700 ">
        <div className="relative w-1/2 h-full">
          <Image
            src="/cars/audi-a5.png"
            alt="audi a5"
            fill
            className="rounded-l-xl"
          ></Image>
          <div className="absolute  top-2 left-3 right-3 flex flex-row items-center justify-between  p-3">
            <div className="bg-blue-600 rounded-full w-15 text-white flex  items-center justify-center">
              <span>{c("sale")}</span>
            </div>
            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
              <Bookmark className="text-foreground" size={17} />
            </div>
          </div>
        </div>
        <div className="flex flex-col pl-7 pt-3 text-white ">
          <div className="flex flex-col gap-1">
            <span>Audi A5 - 2023</span>
            <span className="text-[11px]">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>

          <div className="flex flex-col pt-3 gap-2 text-[13px]">
            <div className="flex flex-row items-center gap-2 text-[13px]">
              <Gauge size={15} /> <span> 500 miles</span>{" "}
            </div>
            <div className="flex flex-row items-center gap-2">
              <Fuel size={15} /> <span> Petrol</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Settings size={15} /> <span> Automatic</span>
            </div>
          </div>

          <div className="pt-5">
            <span className="line-through">$ 50 000</span>
          </div>
          <div className="flex flex-row items-center justify-between gap-13 pb-10">
            <span className="text-xl">$45 000</span>
            <Link href="#" className="flex flex-row items-center ">
              <span>{c("viewDetails")}</span> <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
