'use client'

import Image from "next/image";
import { Play, Check, ArrowUpRight,BadgeDollarSign,BookCheck ,Gem ,Car  } from "lucide-react";
import Link from "next/link";
// import { Button } from "../ui/button";
export default function Something() {
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
              Get A Fair Price For Your Car
            </span>
            <span className=" text-3xl font-sans font-bold">
              Car Sell To Us Today
            </span>
          </div>
          <div className="flex gap-3 pt-3">
            <span className="text-[15px] font-sans  ">
              We are committed to providing our customers with exceptional
              service, competitive pricing, and a wide range of.
            </span>
          </div>
          <div className="flex flex-col  gap-3 pt-3 text-sans font-semibold">
            <div className="flex items-center gap-2  ">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  We are the UK’s largest provider, with more patrols in more
                  places
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  You get 24/7 roadside assistance
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className=" bg-white rounded-full size-4 flex items-center justify-center">
                <Check size="14" />
              </div>
              <div>
                <span className="text-sm">
                  We fix 4 out of 5 cars at the roadside
                </span>
              </div>
            </div>
          </div>

          <div className=" h-20 pt-6 flex flex-row">
           
            <button className="h-20 w-30 bg-blue-600 flex flex-row items-center justify-center rounded-xl"  onClick={() => window.scrollTo({top:0,behavior:'smooth'})}  >
              
              Get Started <ArrowUpRight size='15' />{" "}
            </button>{" "}
          </div>
        </div>
      </div>
      <div className=" flex flex-row items-center justify-center w-300 h-40 gap-40 font-sans">
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 836M</span>
          <span className="text-[12px]"> CARS FOR SALES</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 738M</span>
          <span className="text-[12px]"> DEALER REVIEWS</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 100M</span>
          <span className="text-[12px]"> VISITORS PER DAY</span>
        </div>
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl font-bold"> 238M</span>
          <span className="text-[12px]"> VERIFIED DEALERS</span>
        </div>
      </div>
      <div className="border bg-muted w-full h  "> </div>








      <div className="flex flex-col  w-300  h-90 pt-20">
        <div className="text-[30px] font-sans font-semibold">
          <span> Why Choose Us ?</span>
        </div>
        <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2  w-70 text-sm pt-6">
          <div><BadgeDollarSign size = '35' className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>Special Financing Offers</span>
          </div>
          <div>
            <span>
              Our stress-free finance department that can find financial
              solutions to save you money.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><BookCheck  size = '35' className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>Trusted Car Dealership</span>
          </div>
          <div>
            <span>
              Our stress-free finance department that can
find financial solutions to save you money.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><Gem size = '35' className="text-blue-400"/></div>
          <div className="text-[19px]">
            <span>Transparent Pricing</span>
          </div>
          <div>
            <span>
              Our stress-free finance department that can find financial
              solutions to save you money.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-70 text-sm pt-6">
          <div><Car size = '35'className="text-blue-400" /></div>
          <div className="text-[19px]">
            <span>Expert Car Service</span>
          </div>
          <div>
            <span>
              Our stress-free finance department that can find financial
              solutions to save you money.
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
