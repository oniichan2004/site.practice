import Link from "next/link";
// import {Button} from  "@/components/ui/button"
import { ArrowUpRight, Car, Van } from "lucide-react";
export default function SellBuy() {
  return (

    <div className = " bg-white rounded-b-[70px] relative z-10">
    <div className="pt-30 pl-50 flex flex-row gap-20 h-150 ">
      <div className="  pl-20 pt-15 pr-15 w-120 h-80 flex flex-col gap-3  bg-blue-100 rounded-xl">
        <div className="text-2xl flex flex-col  font-bold font-sans ">
          <span> Are You Looking</span>
          <span>For a Car ?</span>
        </div>
        <div className="text-sm ">
          <span>
            We are committed to providing our customers with exceptional
            service.
          </span>
        </div>
        <div className="flex flex-row items-center  gap-34  text-white ">
          <div className="flex flex-row items-center justify-center bg-[#405FF2] w-33 h-15 rounded-xl ">
            <Link
              href="#"
              className="flex flex-row items-center justify-center "
            >
              {" "}
              Get Started <ArrowUpRight size="20" />{" "}
            </Link>
          </div>
          <div className="">
            <Car size="90" className="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="  pl-20 pt-15 pr-15 w-120 h-80 flex flex-col gap-3  bg-pink-100 rounded-xl">
        <div className="text-2xl flex flex-col  font-bold font-sans ">
          <span>Do You Want to</span>
          <span>Sell a Car ?</span>
        </div>
        <div className="text-sm ">
          <span>
            We are committed to providing our customers with exceptional
            service.
          </span>
        </div>
        <div className="flex flex-row items-center  gap-34 text-white  ">
          <div className="flex flex-row items-center justify-center bg-black w-33 h-15 rounded-xl ">
            <Link
              href="#"
              className="flex flex-row items-center justify-center "
            >
              {" "}
              Get Started <ArrowUpRight size="20" />{" "}
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
