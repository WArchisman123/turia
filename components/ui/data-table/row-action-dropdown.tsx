"use client";

import React, { useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface RowActionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  width?: number;
}

const emptySubscribe = () => () => {};

/**
 * RowActionDropdown
 * A portaled dropdown menu designed specifically for table rows.
 * Mounts directly into `document.body` to completely escape `overflow-x-auto`,
 * `overflow-hidden`, and table stacking context clipping, ensuring it never
 * gets trapped underneath table pagination or table borders.
 */
export function RowActionDropdown({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = "",
  width = 176,
}: RowActionDropdownProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const GAP = 6;
    const menuEl = menuRef.current;
    const menuHeight = menuEl.offsetHeight || 140;
    const menuWidth = menuEl.offsetWidth || width;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Viewport collision detection: open upwards if constrained below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < menuHeight + GAP && spaceAbove > spaceBelow;

    const top = openUpward
      ? Math.max(8, rect.top - menuHeight - GAP)
      : Math.min(viewportHeight - menuHeight - 8, rect.bottom + GAP);

    // Right-aligned to the trigger button, clamped within viewport bounds
    let right = viewportWidth - rect.right;
    if (right < 8) right = 8;
    if (viewportWidth - right < menuWidth) {
      right = Math.max(8, viewportWidth - menuWidth - 8);
    }

    menuEl.style.top = `${Math.round(top)}px`;
    menuEl.style.right = `${Math.round(right)}px`;
    menuEl.style.visibility = "visible";
  }, [triggerRef, width]);

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    // Use requestAnimationFrame to measure after DOM insertion
    const animId = requestAnimationFrame(() => {
      updatePosition();
    });

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    // Outside click detection
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    // Escape key detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMounted, onClose, triggerRef, updatePosition]);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        visibility: "hidden",
        zIndex: 9999,
        width: `${width}px`,
      }}
      className={`bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-left ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}
