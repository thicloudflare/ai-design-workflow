"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface CreatableSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function CreatableSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Type to search or add new...",
  required = false,
  disabled = false,
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm && filteredOptions.length === 0) {
      e.preventDefault();
      // Add new custom option
      onChange(searchTerm);
      setSearchTerm("");
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const displayValue = value || searchTerm;
  const showCreateOption =
    searchTerm &&
    !options.some((opt) => opt.toLowerCase() === searchTerm.toLowerCase()) &&
    filteredOptions.length === 0;

  return (
    <div ref={dropdownRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="bg-kumo-elevated border border-kumo-line rounded-lg px-4 py-3 text-base text-text-default focus:outline-none focus:border-kumo-brand focus:ring-1 focus:ring-kumo-brand transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        autoComplete="off"
      />

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-kumo-overlay border border-kumo-line rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(option)}
                className={clsx(
                  "w-full text-left px-4 py-3 text-base transition-colors",
                  value === option
                    ? "bg-kumo-brand text-white"
                    : "text-text-default hover:bg-kumo-tint"
                )}
              >
                {option}
              </button>
            ))
          ) : showCreateOption ? (
            <button
              type="button"
              onClick={() => handleSelect(searchTerm)}
              className="w-full text-left px-4 py-3 text-base text-kumo-brand-text hover:bg-kumo-tint transition-colors"
            >
              <span className="text-text-subtle">Create: </span>&quot;{searchTerm}&quot;
            </button>
          ) : (
            <div className="px-4 py-3 text-base text-text-subtle italic">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
