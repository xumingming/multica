"use client";

import { useEffect } from "react";
import { useAuthStore } from "@multica/core/auth";
import type { FontFamily } from "@multica/core/types";

const STORAGE_KEY = "multica_font_family";

function applyFont(fontFamily: FontFamily | undefined) {
  const value = fontFamily ?? "geist-sans";
  if (value === "geist-sans") {
    delete document.documentElement.dataset.fontFamily;
  } else {
    document.documentElement.dataset.fontFamily = value;
  }
}

// Apply cached font preference immediately on import (before React renders)
// to avoid flash of wrong font.
if (typeof window !== "undefined") {
  const cached = localStorage.getItem(STORAGE_KEY) as FontFamily | null;
  if (cached) applyFont(cached);
}

/**
 * Syncs the user's font preference from the auth store to the DOM.
 * Place this component once in the root layout of each app.
 */
export function FontSync() {
  const fontFamily = useAuthStore((s) => s.user?.preferences?.fontFamily);

  useEffect(() => {
    applyFont(fontFamily);
    if (fontFamily) {
      localStorage.setItem(STORAGE_KEY, fontFamily);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [fontFamily]);

  return null;
}
