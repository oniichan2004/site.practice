"use client";

import { useState } from "react";
import { cars } from "@/data/cars";
import CardCar from "./card-car";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS_PER_PAGE = 4;

export default function CarCarousel() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(cars.length / CARDS_PER_PAGE);

  const start = (page - 1) * CARDS_PER_PAGE;
  const visibleCars = cars.slice(start, start + CARDS_PER_PAGE);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
        {visibleCars.map((car) => (
          <CardCar key={car.id} car={car} />
        ))}
      </div>

      <div className="flex flex-row items-center gap-4 justify-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="border rounded-full w-12 h-8 flex items-center justify-center disabled:opacity-40"
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="border rounded-full w-12 h-8 flex items-center justify-center disabled:opacity-40"
          aria-label="Next"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
