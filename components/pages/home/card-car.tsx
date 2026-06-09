import Link from "next/link";
import Image from "next/image";
import { Gauge, Fuel, Settings, ArrowUpRight, Bookmark } from "lucide-react";

export default function CardCar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-7">
      <div className="flex items-center justify-center   ">
        <div className=" relative w-70 h-95   rounded-2xl border ">
          <Image
            src="/cars/ford-transit.jpg"
            alt="car"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />

          <div className=" absolute top-4 left-4  right-4 flex justify-between items-center  ">
            <div className=" bg-green-600 rounded-full text-white w-25 flex items-center justify-center">
              <span>Great Price</span>
            </div>
            <div className=" bg-white rounded-full size-8 flex items-center justify-center">
              <Bookmark size={20} />
            </div>
          </div>

          <div className="  pt-2 pb-2">
            <span className="text-xl font-bold pl-5 pb-1">
              Ford Transit - 2021
            </span>
            <br />
            <span className="text-sm pl-5 ">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center pl-5 gap-11 pt-2  pb-3">
            <div className=" flex flex-col items-center gap-1">
              <Gauge size={14} /> <span className="text-sm">2500 Miles</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Fuel size={14} />
              <span className="text-sm">Diesel</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Settings size={14} />
              <span className="text-sm">Manual</span>
            </div>
          </div>
          <div className="pl-5">
            <div className="border-b border-border w-60"></div>
          </div>
          <div className="flex flex-row items-center justify-between pl-5 pr-5 pt-3">
            <div>
              <span className="font-bold text-2xl">$22,000</span>
            </div>
            <div>
              <Link
                href="#"
                className="flex items-center text-blue-500 text-sm"
              >
                View Details <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Primul card  */}

      <div className="flex items-center justify-center   ">
        <div className=" relative w-70 h-95   rounded-2xl border ">
          <Image
            src="/cars/new-glc.jpg"
            alt="car"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />

          <div className=" absolute top-4 left-4  right-4 flex justify-between items-center  ">
            <div className=" bg-blue-600 rounded-full text-white w-25 flex items-center justify-center">
              <span>Low Milleage</span>
            </div>
            <div className=" bg-white rounded-full size-8 flex items-center justify-center">
              <Bookmark size={20} />
            </div>
          </div>

          <div className=" pt-2 pb-2">
            <span className="text-xl font-bold pl-5 pb-1">New GLC - 2023</span>
            <br />
            <span className="text-sm pl-5 ">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center pl-5 gap-11 pt-2  pb-3">
            <div className=" flex flex-col items-center gap-1">
              <Gauge size={14} /> <span className="text-sm">50 Miles</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Fuel size={14} />
              <span className="text-sm">Petrol</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Settings size={14} />
              <span className="text-sm">Automatic</span>
            </div>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center justify-between pl-5 pr-5 pt-3">
            <div>
              <span className="font-bold text-2xl">$95,000</span>
            </div>
            <div>
              <Link
                href="#"
                className="flex items-center text-blue-500 text-sm"
              >
                View Details <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Al doilea card */}

      <div className="flex items-center justify-center   ">
        <div className=" relative w-70 h-95   rounded-2xl border ">
          <Image
            src="/cars/audi.jpg"
            alt="car"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />

          <div className=" absolute top-4 right-4 ">
            <div className=" bg-white rounded-full size-8 flex items-center justify-center">
              <Bookmark size={20} />
            </div>
          </div>

          <div className=" pt-2 pb-2">
            <span className="text-xl font-bold pl-5 pb-1">
              Audi A6 3.5 - New{" "}
            </span>
            <br />
            <span className="text-sm pl-5 ">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center pl-5 gap-11 pt-2  pb-3">
            <div className=" flex flex-col items-center gap-1">
              <Gauge size={14} /> <span className="text-sm">100 Miles</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Fuel size={14} />
              <span className="text-sm">Petrol</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Settings size={14} />
              <span className="text-sm">Automatic</span>
            </div>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center justify-between pl-5 pr-5 pt-3">
            <div>
              <span className="font-bold text-2xl">$58,000</span>
            </div>
            <div>
              <Link
                href="#"
                className="flex items-center text-blue-500 text-sm"
              >
                View Details <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Al 3card */}

      <div className="flex items-center justify-center  ">
        <div className=" relative w-70 h-95   rounded-2xl border ">
          <Image
            src="/cars/corolla.jpg"
            alt="car"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />

          <div className=" absolute top-4 right-4  ">
            <div className=" bg-white rounded-full size-8 flex items-center justify-center">
              <Bookmark size={20} />
            </div>
          </div>

          <div className=" pt-2 pb-2">
            <span className="text-xl font-bold pl-5 pb-1">
              Corolla Altis - 2023{" "}
            </span>
            <br />
            <span className="text-sm pl-5 ">
              4.0 D5 PowerPulse Momentum 5dr AW..
            </span>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center pl-5 gap-11 pt-2  pb-3">
            <div className=" flex flex-col items-center gap-1">
              <Gauge size={14} /> <span className="text-sm">15000 Miles</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Fuel size={14} />
              <span className="text-sm">Petrol</span>
            </div>
            <div className=" flex flex-col items-center gap-1">
              <Settings size={14} />
              <span className="text-sm">CVT</span>
            </div>
          </div>
          <div className="pl-5">
            <div className="border-b border-gray-200  w-60"></div>
          </div>
          <div className="flex flex-row items-center justify-between pl-5 pr-5 pt-3">
            <div>
              <span className="font-bold text-2xl">$45,000</span>
            </div>
            <div>
              <Link
                href="#"
                className="flex items-center text-blue-500 text-sm"
              >
                View Details <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* al 4 card */}
    </div>
  );
}
