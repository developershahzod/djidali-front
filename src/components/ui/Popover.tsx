import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  className?: string;
  triggerClassName?: string;
}

/**
 * Popover component using portal to escape overflow:hidden containers
 */
export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = "start",
  className,
  triggerClassName,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let left = rect.left + scrollX;
      if (align === "center") {
        left = rect.left + scrollX + rect.width / 2;
      } else if (align === "end") {
        left = rect.right + scrollX;
      }

      setPosition({
        top: rect.bottom + scrollY + 8,
        left,
      });
    }
  }, [isOpen, align]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, setOpen]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let left = rect.left + scrollX;
        if (align === "center") {
          left = rect.left + scrollX + rect.width / 2;
        } else if (align === "end") {
          left = rect.right + scrollX;
        }

        setPosition({
          top: rect.bottom + scrollY + 8,
          left,
        });
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, align]);

  const transformOrigin =
    align === "center"
      ? "top center"
      : align === "end"
        ? "top right"
        : "top left";

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform:
          align === "center"
            ? "translateX(-50%)"
            : align === "end"
              ? "translateX(-100%)"
              : "none",
        transformOrigin,
        zIndex: 99999,
      }}
      className={cn(
        "bg-white rounded-xl shadow-2xl border border-gray-100",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className,
      )}
    >
      {children}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!isOpen)}
        className={cn("cursor-pointer", triggerClassName)}
      >
        {trigger}
      </div>
      {popoverContent && createPortal(popoverContent, document.body)}
    </>
  );
}

export default Popover;
