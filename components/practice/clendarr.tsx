"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker"
export function CalendarDemo() {
  const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div className="flex  items-center justify-center p-30">
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
        captionLayout="dropdown"
      />
    </div>
  );
}
