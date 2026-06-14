"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
export default function Aspect() {
  return (
    <div className="w-100 h-150 bg-gray-200">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="/side-car.png"
          alt="car"
          fill
          className="object-cover w-1/2"
        />
      </AspectRatio>
    </div>
  );
}
