import { Button } from "@/components/ui/button";
import { Apple, Guitar, Landmark, Piano, Play, University } from "lucide-react";
export default function Footer() {
  return (
    <div className="flex flex-col -mt-20   ">
      <div className="w-full h-160 bg-foreground  pl-50 pr-50 flex flex-col">
        <div className="flex flex-row items-center justify-between text-white border-b border-gray-800  pt-25  h-70 ">
          <div className="flex flex-col gap-3">
            <span className="text-3xl  font-sans"> Join CarHut</span>
            <span className="text-sm">
              Receive pricing updates, shopping tips & more!
            </span>
          </div>
          <div className=" flex flex-row items-center  justify-between pr-1 pl-6 w-110 h-15   bg-gray-700 rounded-full">
            <input
              type="text"
              placeholder="Your email adress"
              className="outline-none flex-1"
            />
            <Button className="bg-blue-500 rounded-full w-30 h-13 ">
              Sign UP
            </Button>
          </div>
        </div>

        <div className="pt-10 flex flex-row gap-30 text-sm">
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">Company</span>
            <span>About Us</span>
            <span>Blog</span>
            <span>Services</span>
            <span>FAQs</span>
            <span>Terms</span>
            <span>Contact Us</span>
          </div>
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">Quick Links</span>
            <span>Get in Touch</span>
            <span>Help center</span>
            <span>Live chat</span>
            <span>How it works</span>
          </div>
          <div className="flex flex-col gap-3 text-white  font-sans">
            <span className="text-2xl">Our Brands</span>
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
            <span className="text-2xl">Vehicles Type</span>
            <span>Sedan</span>
            <span>Hatchbag</span>
            <span>SUV</span>
            <span>Hybrid</span>
            <span>Electric</span>
            <span>Coupe</span>
            <span>Truck</span>
            <span>Convertibile</span>
          </div>
          <div className="flex flex-col gap-3 text-white font-sans">
            <span className="text-2xl">Our Mobile App</span>
            <div className=" flex flex-col gap-4">
              <button className="bg-gray-700 w-40 h-13 rounded-xl hover:bg-gray-500">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Apple />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[11px]">Download on the </span>
                    <span className="text-[17px]">Apple Store</span>
                  </div>
                </div>
              </button>
              <button className="bg-gray-700 w-40 h-13 rounded-xl hover:bg-gray-500">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Play />
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[11px]">Get it on </span>
                    <span className="text-[17px]"> Google Play</span>
                  </div>
                </div>
              </button>
            </div>
            <span className="text-2xl font-sans pt-4">Connect With Us</span>

            <div className="flex flex-row gap-7">
              <Landmark size="15" />
              <University size="15" />
              <Piano size="15" />
              <Guitar size="15" />
            </div>
          </div>
        </div>
        
      </div>

<div className="flex flex-row items-center justify-between w-full h-20 bg-foreground border-t border-gray-800 px-50 text-white">

<span>2025 example.com. All rights reserved</span>
<span> Terms & Conditions  Privacy Notice</span>
</div>


    </div>
  );
}
