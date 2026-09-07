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

/** Distance between the trigger and the popover, in px. */
const GAP = 8;

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

  // Places the popover under the trigger, flipping it above when the space
  // below is too small for its content (e.g. a calendar opened near the
  // bottom of the screen or inside a modal).
  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;

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
    if (popoverRef.current) {
      const popoverWidth = popoverRef.current.offsetWidth;
      const maxLeft = window.innerWidth + scrollX - 8 - popoverWidth;
      left = Math.min(left, Math.max(scrollX + 8, maxLeft));
    }

    let top = rect.bottom + scrollY + GAP;
    const height = popoverRef.current?.offsetHeight ?? 0;
    if (height) {
      const spaceBelow = window.innerHeight - rect.bottom - GAP;
      const spaceAbove = rect.top - GAP;

      if (height > spaceBelow && spaceAbove > spaceBelow) {
        // Flip above the trigger
        top = Math.max(scrollY + GAP, rect.top + scrollY - height - GAP);
      } else {
        // Keep below, but never let it hang past the bottom of the viewport
        const maxTop = scrollY + window.innerHeight - GAP - height;
        top = Math.max(scrollY + GAP, Math.min(top, maxTop));
      }
    }

    setPosition({ top, left });
  }, [align]);

  // Initial (pre-measurement) placement when opening
  useEffect(() => {
    if (isOpen) {
      computePosition();
    }
  }, [isOpen, computePosition]);

  // Re-measure once the content is painted: only then do we know the popover's
  // real size, which decides whether it has to flip above the trigger.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => computePosition());
    return () => cancelAnimationFrame(frame);
  }, [isOpen, computePosition]);

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

    const updatePosition = () => computePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, computePosition]);

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
        // Taller-than-screen content (e.g. a calendar on a small phone) stays
        // reachable instead of being cut off.
        maxHeight: "calc(100vh - 16px)",
        overflowY: "auto",
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
