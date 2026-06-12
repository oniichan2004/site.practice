"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Acordion() {
  return (
    <div>
      <Accordion type="single" collapsible onValueChange={(value) => console.log("value:", value)} >
        <AccordionItem value="item-1" >
          <AccordionTrigger>Tap here</AccordionTrigger>
          <AccordionContent> la lal la</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
