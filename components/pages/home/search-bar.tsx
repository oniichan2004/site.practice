import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function SearchBar() {
  return (
    <div  className="mt-6 flex h-[68px] w-full max-w-[900px] items-center rounded-full bg-white px-4 text-black shadow-lg text-sm md:text-base">
      <Select>
        <SelectTrigger className="h-12 w-[180px] border-0 bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Any Makes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any-makes">Any Makes</SelectItem>
          <SelectItem value="specific-make">Specific Make</SelectItem>
          <SelectItem value="specific-make">Specific Make</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 w-px bg-gray-200"  />
      <Select>
        <SelectTrigger className="h-12 w-[180px] border-0 bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Any Models" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any-makes">Any Models</SelectItem>
          <SelectItem value="specific-make">Specific Model</SelectItem>
          <SelectItem value="specific-make">Specific Model</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 w-px bg-gray-200"  />

      <div className="flex flex-row gap-5 px-4 ">
        <span className="text-gray-500"> Prices: </span>
        <span className="text-gray-500 whitespace-nowrap"> All Prices </span>
      </div>
      <Button variant="search" className="h-13">
        <Search />
        Search Cars
      </Button>
    </div>
  );
}
