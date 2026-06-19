"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const fuelOptions = ["Petrol", "Diesel"];
const transmissionOptions = ["Manual", "Automatic", "CTV"];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fuels, setFuels] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setMinPrice("");
    setMaxPrice("");
    setFuels([]);
    setTransmissions([]);
  }

  return (
    <div className="relative flex shrink-0">
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "w-64" : "w-0"
        }`}
      >
        <div
          className={`w-64 flex flex-col border-r h-full p-5 gap-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
              >
                <X size={14} /> Clear all
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center size-7 rounded-full border hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex flex-col gap-3">
            <span className="font-semibold text-sm">Price Range</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex flex-col gap-3">
            <span className="font-semibold text-sm">Fuel Type</span>
            {fuelOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={fuels.includes(option)}
                  onChange={() => toggle(fuels, setFuels, option)}
                  className="accent-blue-600 size-4"
                />
                {option}
              </label>
            ))}
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex flex-col gap-3">
            <span className="font-semibold text-sm">Transmission</span>
            {transmissionOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={transmissions.includes(option)}
                  onChange={() => toggle(transmissions, setTransmissions, option)}
                  className="accent-blue-600 size-4"
                />
                {option}
              </label>
            ))}
          </div>

          <button className="mt-2 w-full bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center size-8 rounded-full border bg-white shadow-sm hover:shadow-md"
          aria-label="Open sidebar"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
