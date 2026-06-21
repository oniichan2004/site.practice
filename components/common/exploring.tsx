import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import CardCar from "../pages/home/card-car";
import { cars } from "@/data/cars";
export default function Exploring() {
  return (
    <div>
      <div className=" h-190 flex flex-col gap-6 pt-20">
        <div className="flex flex-row items-center justify-between  pl-40 pr-40">
          <span className="text-3xl">Explore All Vehicles</span>
          <Link href="#" className="flex flex-row items-center pr-13 ">
            View All
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className=" flex flex-row gap-4 text-sm pl-40">
          <Link href="#">
            <span>In Stock</span>
          </Link>{" "}
          <Link href="#">
            <span>New Cars</span>
          </Link>{" "}
          <Link href="#">
            <span>Used Cars</span>
          </Link>
        </div>
        <div className="flex w-full items-center pl-40 pr-53">
          <div className="h-0.5 w-14 bg-blue-500"></div>
          <div className="h-0.5 flex-1 bg-border"></div>
        </div>
        <div className=" pl-40  grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-7 justify-items-center">
          {cars.map((car) => (
            <CardCar key={car.id} car={car} />
          ))}
        </div>
        <div className="flex flex-row items-center  pl-44 gap-4 pt-8 ">
          <div className="border rounded-full  w-12 h-8 flex items-center justify-center">
            <button aria-label="left">
              <ChevronLeft />
            </button>
          </div>
          <div className="border rounded-full  w-12 h-8 flex items-center justify-center">
            <button aria-label="right">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
