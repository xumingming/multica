"use client";

import { useEffect } from "react";
import { useAuthStore } from "@multica/core/auth";
import type { FontFamily, CodeFontFamily } from "@multica/core/types";

const FONT_STORAGE_KEY = "multica_font_family";
const CODE_FONT_STORAGE_KEY = "multica_code_font_family";

function applyFont(fontFamily: FontFamily | undefined) {
  const value = fontFamily ?? "geist-sans";
  if (value === "geist-sans") {
    delete document.documentElement.dataset.fontFamily;
  } else {
    document.documentElement.dataset.fontFamily = value;
  }
}

function applyCodeFont(codeFontFamily: CodeFontFamily | undefined) {
  const value = codeFontFamily ?? "geist-mono";
  if (value === "geist-mono") {
    delete document.documentElement.dataset.codeFontFamily;
  } else {
    document.documentElement.dataset.codeFontFamily = value;
  }
}

// Apply cached preferences immediately on import (before React renders)
// to avoid flash of wrong font.
if (typeof window !== "undefined") {
  const cachedFont = localStorage.getItem(FONT_STORAGE_KEY) as FontFamily | null;
  if (cachedFont) applyFont(cachedFont);
  const cachedCodeFont = localStorage.getItem(CODE_FONT_STORAGE_KEY) as CodeFontFamily | null;
  if (cachedCodeFont) applyCodeFont(cachedCodeFont);
}

/**
 * Syncs the user's font preferences from the auth store to the DOM.
 * Place this component once in the root layout of each app.
 */
export function FontSync() {
  const fontFamily = useAuthStore((s) => s.user?.preferences?.fontFamily);
  const codeFontFamily = useAuthStore((s) => s.user?.preferences?.codeFontFamily);

  useEffect(() => {
    applyFont(fontFamily);
    if (fontFamily) {
      localStorage.setItem(FONT_STORAGE_KEY, fontFamily);
    } else {
      localStorage.removeItem(FONT_STORAGE_KEY);
    }
  }, [fontFamily]);

  useEffect(() => {
    applyCodeFont(codeFontFamily);
    if (codeFontFamily) {
      localStorage.setItem(CODE_FONT_STORAGE_KEY, codeFontFamily);
    } else {
      localStorage.removeItem(CODE_FONT_STORAGE_KEY);
    }
  }, [codeFontFamily]);

  return null;
}
