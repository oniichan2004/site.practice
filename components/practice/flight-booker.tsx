"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FlightType = "one-way" | "return";

const INITIAL_DATE = "27.03.2014";
const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;

function parseDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isRealCalendarDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isRealCalendarDate ? date : null;
}

export function FlightBooker() {
  const [flightType, setFlightType] = useState<FlightType>("one-way");
  const [startDateInput, setStartDateInput] = useState(INITIAL_DATE);
  const [returnDateInput, setReturnDateInput] = useState(INITIAL_DATE);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const isReturnFlight = flightType === "return";

  const startDate = parseDate(startDateInput);
  const returnDate = parseDate(returnDateInput);

  const isStartDateInvalid = startDate === null;
  const isReturnDateInvalid = isReturnFlight && returnDate === null;
  const isReturnBeforeStart =
    isReturnFlight &&
    startDate !== null &&
    returnDate !== null &&
    returnDate < startDate;

  const isBookingDisabled =
    isStartDateInvalid || isReturnDateInvalid || isReturnBeforeStart;

  function handleFlightTypeChange(value: string): void {
    setFlightType(value as FlightType);
    setConfirmation(null);
  }

  function handleStartDateChange(value: string): void {
    setStartDateInput(value);
    setConfirmation(null);
  }

  function handleReturnDateChange(value: string): void {
    setReturnDateInput(value);
    setConfirmation(null);
  }

  function handleBook(): void {
    if (isBookingDisabled) return;

    setConfirmation(
      isReturnFlight
        ? `You have booked a return flight from ${startDateInput} to ${returnDateInput}.`
        : `You have booked a one-way flight on ${startDateInput}.`,
    );
  }

  return (
    <div className="flex w-64 flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <Select value={flightType} onValueChange={handleFlightTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one-way">one-way flight</SelectItem>
          <SelectItem value="return">return flight</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={startDateInput}
        aria-invalid={isStartDateInvalid}
        onChange={(e) => handleStartDateChange(e.target.value)}
      />

      <Input
        type="text"
        value={returnDateInput}
        disabled={!isReturnFlight}
        aria-invalid={isReturnDateInvalid}
        onChange={(e) => handleReturnDateChange(e.target.value)}
      />

      <Button type="button" disabled={isBookingDisabled} onClick={handleBook}>
        Book
      </Button>

      {confirmation && (
        <p className="text-sm text-muted-foreground">{confirmation}</p>
      )}
    </div>
  );
}
