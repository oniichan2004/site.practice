"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, CarFront } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/pages/home/search-bar";
import ThemeToggle from "@/components/common/theme-toggle";
import LanguageToggle from "@/components/common/language-toggle";
import { useLanguage } from "@/components/common/language-context";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className=" min-h-screen">
      <div className="relative h-[600px] w-full">
        <Image
          src="/hero.jpg"
          alt="Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover z-0"
        />

        <div className="absolute left-0 right-0 z-10">
          <div>
            <header className=" flex items-center justify-between pl-9">
              <Image src="/logo.png" alt="Logo" width={110} height={110} />
              <div className="flex items-center gap-8 text-white  pr-15 ">
                <Link href="/" className="flex items-center">
                  <select name="" id="">
                    <option value="home">{t("home")}</option>
                  </select>
                </Link>
                <Link href="/" className="flex items-center">
                  <select name=" " id=" ">
                    <option value="listings">{t("listings")}</option>
                  </select>
                </Link>
                <Link href="#" className="flex items-center">
                  <select name="" id="">
                    <option value="blog">{t("blog")}</option>
                  </select>
                </Link>
                <Link href="#" className="flex items-center">
                  <select name="" id="">
                    <option value="pages">{t("pages")}</option>
                  </select>
                </Link>
                <Link href="#" className="flex items-center">
                  <span>{t("about")}</span>
                </Link>
                <Link href="#" className="flex items-center">
                  <span>{t("contact")}</span>
                </Link>
                <Link href="#" className="flex items-center gap-1">
                  <User size={16} /> <span>{t("signIn")}</span>{" "}
                </Link>

                <Button variant="custom">{t("submitListing")}</Button>
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </header>
            <div className=" mt-15 flex flex-col items-center text-center text-white">
              <p className=" text-sm md:text-lg ">{t("findCars")}</p>

              <p className="mt-4 text-xl font-bold md:text-4xl  lg:text-6xl">{t("perfectCar")}</p>

              <div className="mt-6 flex gap-6 text-sm">
                <button className="border-b border-white pb-2 cursor-pointer">
                  {t("all")}
                </button>
                <button className="pb-2 cursor-pointer">{t("newCar")}</button>
                <button className="pb-2 cursor-pointer">{t("used")}</button>
              </div>
              <SearchBar />
              <br />
              <p>{t("browseFeatured")}</p>
              <br />
              <div className="flex gap-5">
                <Button variant="featured"> <CarFront /> Suv</Button>
                <Button variant="featured"> <CarFront /> Sedan</Button>
                <Button variant="featured"> <CarFront /> Hatchback</Button>
                <Button variant="featured"> <CarFront /> Coupe</Button>
                <Button variant="featured"> <CarFront /> Hybrid</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
