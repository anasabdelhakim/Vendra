"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import "leaflet/dist/leaflet.css";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import countryList from "react-select-country-list";


type CountryOption = { label: string; value: string };

export default function CountryMapCombobox() {
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryOption | null>(null);

  const [input, setInput] = React.useState("");

  const countries: CountryOption[] = React.useMemo(
    () => countryList().getData(),
    []
  );

  const filteredCountries = React.useMemo(() => {
    if (!input) return countries;
    return countries.filter((c) =>
      c.label.toLowerCase().includes(input.toLowerCase())
    );
  }, [input, countries]);



  return (

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedCountry ? selectedCountry.label : "Select a country..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command>
            <CommandInput
              placeholder="Search country..."
              value={input}
              onValueChange={setInput}
              className="h-9 "
            />
            <CommandList className="mt-1">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={() => {
                      setSelectedCountry(country);
                      setOpen(false);
                      setInput(country.label);
                    }}
                  >
                    {country.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedCountry?.value === country.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

  );
}
