"use client";

import { useEffect, useState } from "react";
import Timer from "@/components/practice/timer";
import { FlightBooker } from "@/components/practice/flight-booker";
import Users from "@/components/practice/users";
import HeroSection from "@/components/common/hero-section";
export default function Teste() {
  const [count, setCount] = useState(0);
  const [fahrenheit, setFahrenheit] = useState("");
  const [celsius, setCelsius] = useState("");
  const [is, setIs] = useState(false);

  function celsiusToFahrenheite(value: string) {
    setCelsius(value);
    if (value === "") {
      setFahrenheit("");
      return;
    }

    const celsius = Number(value);
    const result = celsius * (9 / 5) + 32;

    setFahrenheit(String(result));
  }

  useEffect(() => {
    console.log("mount");
    return () => console.log("unmount");
  }, []);

  function fahrenheitToCelsius(value: string) {
    setFahrenheit(value);
    if (value === "") {
      setCelsius("");
      return;
    }

    const fahrenheit = Number(value);
    const result = (fahrenheit - 32) * (5 / 9);

    setCelsius(String(result));
  }

  return (
    <div className=" h-screen w-screen ">
      <button onClick={() => setIs(!is)}>Hide</button>
      {is && <Timer />}
      {/* <div className="flex  flex-row   items-center h-50 w-50 p-5 ml-20">
        <input type="text" value={count} readOnly className="h-20 border " />
        <button onClick={() => setCount(count + 1)}>Add</button>
      </div>
      <div className="flex  flex-row  justify-center items-center  gap-20">
        <div className="flex  flex-col justify-center items-center gap-2">
          <input
            type="number"
            className="h-10 border w-20 "
            onChange={(e) => celsiusToFahrenheite(e.target.value)}
            value={celsius}
          />
          <p>Celsius</p>
        </div>

        <div>
          <input
            type="number"
            className="h-10 border w-20 "
            value={fahrenheit}
            onChange={(e) => fahrenheitToCelsius(e.target.value)}
          />
          <p>Fahrenheit</p>
        </div>
      </div>
      <FlightBooker />
      <Timer />
      <Users /> */}
    </div>
  );
}
