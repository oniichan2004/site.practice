import Link from "next/link";
import Image from "next/image";
import { Gauge, Fuel, Settings, ArrowUpRight, Bookmark } from "lucide-react";
import type { cardProps } from "@/data.types/car-types";
import { useTranslations } from "next-intl";

export default function CardCar({ car }: cardProps) {
  const c = useTranslations("common");
  return (
    <div className="relative w-full max-w-70 h-95 rounded-2xl border bg-card text-card-foreground overflow-hidden ">
      <div className="relative w-full h-42.5">
        <Image src={car.img} alt={car.name} fill className="object-cover" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          {car.tag && (
            <div
              className={`rounded-full text-white px-3 py-1 text-sm ${
                car.tagColor === "blue" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              <span>{car.tag}</span>
            </div>
          )}

          <div className="bg-background rounded-full size-8 flex items-center justify-center">
            <Bookmark size={20} />
          </div>
        </div>
      </div>

      <div className="pt-2 pb-2">
        <span className="text-xl font-bold pl-5 pb-1">{car.name}</span>
        <br />
        <span className="text-sm pl-5">{car.description}</span>
      </div>

      <div className="pl-5">
        <div className="border-b border-border w-60"></div>
      </div>

      <div className="flex flex-row items-center pl-5 gap-11 pt-2 pb-3">
        <div className="flex flex-col items-center gap-1">
          <Gauge size={14} />
          <span className="text-sm">{car.mileage}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Fuel size={14} />
          <span className="text-sm">{car.fuel}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Settings size={14} />
          <span className="text-sm">{car.transmission}</span>
        </div>
      </div>

      <div className="pl-5">
        <div className="border-b border-border w-60"></div>
      </div>

      <div className="flex flex-row items-center justify-between pl-5 pr-5 pt-3">
        <span className="font-bold text-2xl">{car.price}</span>

        <Link href="#" className="flex items-center text-blue-500 text-sm">
          {c("viewDetails")} <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
