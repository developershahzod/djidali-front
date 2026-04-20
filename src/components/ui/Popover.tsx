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

      // Clamp to viewport so popover never overflows left edge
      left = Math.max(scrollX + 8, left);

      setPosition({
        top: rect.bottom + scrollY + 8,
        left,
      });
    }
  }, [isOpen, align]);

  // Clamp both edges after popover renders
  // Uses requestAnimationFrame to ensure content is fully painted before measuring
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const frame = requestAnimationFrame(() => {
        if (!popoverRef.current) return;
        const el = popoverRef.current;
        // scrollWidth is immune to CSS transform animations (zoom-in-95)
        const naturalWidth = el.scrollWidth;
        const scrollX = window.scrollX;

        // Convert CSS left (document coords) to viewport coords
        const viewportLeft = position.left - scrollX;

        // Calculate visual edges accounting for align transform
        let visualLeft = viewportLeft;
        if (align === "center") visualLeft -= naturalWidth / 2;
        if (align === "end") visualLeft -= naturalWidth;
        const visualRight = visualLeft + naturalWidth;

        let adjustment = 0;

        // Right overflow
        if (visualRight > window.innerWidth - 8) {
          adjustment = -(visualRight - window.innerWidth + 8);
        }
        // Left overflow (takes priority to keep content readable)
        if (visualLeft + adjustment < 8) {
          adjustment = 8 - visualLeft;
        }

        if (adjustment !== 0) {
          setPosition((prev) => ({ ...prev, left: prev.left + adjustment }));
        }
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen, position.top, align]);

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

        // Clamp to viewport edges
        left = Math.max(scrollX + 8, left);
        if (popoverRef.current) {
          const popoverWidth = popoverRef.current.offsetWidth;
          const maxLeft = window.innerWidth + scrollX - 8 - popoverWidth;
          left = Math.min(left, Math.max(scrollX + 8, maxLeft));
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
        maxWidth: "calc(100vw - 16px)",
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
