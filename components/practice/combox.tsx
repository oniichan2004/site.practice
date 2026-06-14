"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "sasbk", "sadda","adada", "Remix", "Astro"]
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

function Combox() {
  return (
    <div>
      <Input type="text" placeholder="Enter text" className=" w-200" />
      <br />
      <Textarea placeholder="Enter some" className="w-100" />
<br />

      <InputGroup className="w-130 h-10">
        <InputGroupAddon align="inline-start">
 <InputGroupText>  <Search className="size-4" /></InputGroupText>

        </InputGroupAddon>
        <InputGroupInput type="text" placeholder="What do you need" />
        <InputGroupButton>Submit</InputGroupButton>
      </InputGroup>

<InputGroup className="w-120 h-10 ">
        <InputGroupAddon align="inline-start">
 <InputGroupText>  <Search className="size-7" /></InputGroupText>

        </InputGroupAddon>
        <InputGroupTextarea  placeholder="What do you want" />
        <InputGroupButton className="mr-4" variant ='outline'>Submit</InputGroupButton>
      </InputGroup>
<br />

<Combobox items={frameworks} >
      <ComboboxInput placeholder="Select a framework" className='w-140 h-20' />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>





    </div>
  );
}
export default Combox;
