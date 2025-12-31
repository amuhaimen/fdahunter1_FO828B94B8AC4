// components/CustomDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin from trigger
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Toggle dropdown and update position
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(updateDropdownPosition, 0); // Update position after state change
    }
  };

  // Close dropdown when clicking outside - FIXED VERSION
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both trigger and dropdown
      const isTriggerClick = triggerRef.current?.contains(event.target as Node);
      const isDropdownClick = dropdownRef.current?.contains(event.target as Node);
      
      if (!isTriggerClick && !isDropdownClick) {
        setIsOpen(false);
      }
    };

    // Use capture phase to ensure we catch all clicks
    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  // Also close on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  // Update position on window resize/scroll
  useEffect(() => {
    if (isOpen) {
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Focus first option when dropdown opens
      const firstButton = dropdownRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="w-full px-4 py-3.5 text-left border border-[#687588] rounded-lg 
                 bg-transparent backdrop-blur-sm hover:bg-white/10 
                 focus:outline-none focus:border-none focus:ring-1 focus:ring-[#00f474] 
                 transition-all duration-200"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex justify-between items-center">
          <span className={`${selectedOption ? 'text-white text-sm' : 'text-white text-sm'}  `}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-[#0e121b] border border-white/10 
                   rounded-lg shadow-lg backdrop-blur-sm overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
          role="listbox"
          aria-labelledby="dropdown-label"
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full px-4 py-3 text-left transition-colors duration-150
                          hover:bg-white/10 active:bg-white/15 focus:bg-white/10 focus:outline-none
                          ${option.value === value 
                            ? 'bg-white/20 text-white font-medium' 
                            : 'text-white/90'
                          }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus(); // Return focus to trigger
                }}
                role="option"
                aria-selected={option.value === value}
                tabIndex={0}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}