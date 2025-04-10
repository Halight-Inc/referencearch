import { useState, useRef, useEffect } from "react";
import { X, Check, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type MultiSelectInputProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function MultiSelectInput({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled = false,
}: MultiSelectInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle selection/deselection of an option
  const handleSelect = (option: Option) => {
    const isSelected = value.some((item) => item.value === option.value);
    
    if (isSelected) {
      onChange(value.filter((item) => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
    
    // Focus the input after selection
    inputRef.current?.focus();
  };
  
  // Handle removal of a selected option
  const handleRemove = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item.value !== option.value));
  };
  
  // Handle addition of custom option when typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      
      // Check if option already exists or is selected
      const existingOption = options.find(
        (option) => option.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (existingOption) {
        if (!value.some((item) => item.value === existingOption.value)) {
          handleSelect(existingOption);
        }
      } else {
        const newOption = { value: inputValue.trim(), label: inputValue.trim() };
        handleSelect(newOption);
      }
      
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  
  // Filter options based on input value
  const filteredOptions = options.filter((option) => {
    // Don't filter if input is empty
    if (inputValue === "") return true;
    
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  });

  // Add the typed option if it doesn't exist in the filtered list
  const shouldAddCustomOption = 
    inputValue.trim() !== "" && 
    !filteredOptions.some((option) => 
      option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
  if (shouldAddCustomOption) {
    filteredOptions.push({ label: `Add "${inputValue}"`, value: inputValue });
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        !document.querySelector(".popover-content")?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex min-h-12 w-full flex-wrap items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-slate-300 transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => {
            if (!disabled) {
              setOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mr-2">
              {value.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                >
                  {option.label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-blue-500 hover:text-blue-700 hover:bg-transparent"
                    onClick={(e) => handleRemove(option, e)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {option.label}</span>
                  </Button>
                </Badge>
              ))}
            </div>
          ) : null}
          <div className="flex flex-1 items-center">
            {value.length === 0 && !inputValue && (
              <Search className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
            )}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-900 min-w-[120px]"
              placeholder={value.length > 0 ? "" : placeholder}
              disabled={disabled}
            />
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 popover-content shadow-lg border border-slate-200" 
        align="start"
      >
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
            <input
              placeholder="Search options..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-sm"
            />
          </div>
          <CommandEmpty className="py-3 text-center text-sm text-slate-500">
            No options found.
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.some((item) => item.value === option.value);
                const isCustomOption = option.label.startsWith('Add "');
                
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center justify-between px-2 py-1.5 mx-1 rounded-md data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700"
                  >
                    <span className="flex items-center">
                      {isCustomOption ? (
                        <Plus className="mr-2 h-3.5 w-3.5 text-blue-500" />
                      ) : null}
                      {option.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                  </CommandItem>
                );
              })
            ) : null}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
