import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
export default function Brands() {
  return (
    <div className="-mt-43">
      <div className="bg-gray-100 flex flex-row items-center  justify-between pl-40 pr-40  h-32 relative   rounded-t-4xl font-sans ">
        <p className=" text-3xl pt-15  ">Explore Our Premium Brands</p>
        <Link href="#" className="pt-15 flex items-center pr-13">
          Show All Brands
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="bg-gray-100 flex h-70 flex-row gap-9  p-4 pl-40 pr-40">
        <Link href="#">
          <div className=" bg-white w-43 h-35 rounded-3xl  flex flex-col items-center   ">
            <Image
              src="/brand-logo/audi.jpg"
              alt="Audi"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">Audi</span>
          </div>
        </Link>

        <Link href="#">
          <div className=" bg-white w-40 h-35 rounded-3xl  flex flex-col items-center ">
            <Image
              src="/brand-logo/bmw.jpg"
              alt="BMW"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">BMW</span>
          </div>
        </Link>

        <Link href="#">
          <div className=" bg-white w-40 h-35 rounded-3xl flex flex-col items-center">
            <Image
              src="/brand-logo/mercedes.jpg"
              alt="Mercedes"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">Mercedes</span>
          </div>
        </Link>

        <Link href="#">
          <div className=" bg-white w-40 h-35 rounded-3xl flex flex-col items-center">
            <Image
              src="/brand-logo/ford.jpg"
              alt="Ford"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">Ford</span>
          </div>
        </Link>

        <Link href="#">
          <div className=" bg-white w-40 h-35 rounded-3xl flex flex-col items-center">
            <Image
              src="/brand-logo/peugeot.jpg"
              alt="Peugeot"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">Peugeot</span>
          </div>
        </Link>
        <Link href="#">
          <div className=" bg-white w-40 h-35 rounded-3xl flex flex-col items-center">
            <Image
              src="/brand-logo/volkswagen.jpg"
              alt="Volkswagen"
              width={100}
              height={100}
            />
            <span className="pb-2 font-semibold">Volkswagen</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
