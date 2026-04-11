"use client";

import { useState } from "react";
import { useTheme } from "@multica/ui/components/common/theme-provider";
import { cn } from "@multica/ui/lib/utils";
import { useAuthStore } from "@multica/core/auth";
import { api } from "@multica/core/api";
import { toast } from "sonner";
import type { FontFamily } from "@multica/core/types";

const LIGHT_COLORS = {
  titleBar: "#e8e8e8",
  content: "#ffffff",
  sidebar: "#f4f4f5",
  bar: "#e4e4e7",
  barMuted: "#d4d4d8",
};

const DARK_COLORS = {
  titleBar: "#333338",
  content: "#27272a",
  sidebar: "#1e1e21",
  bar: "#3f3f46",
  barMuted: "#52525b",
};

function WindowMockup({
  variant,
  className,
}: {
  variant: "light" | "dark";
  className?: string;
}) {
  const colors = variant === "light" ? LIGHT_COLORS : DARK_COLORS;

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Title bar */}
      <div
        className="flex items-center gap-[3px] px-2 py-1.5"
        style={{ backgroundColor: colors.titleBar }}
      >
        <span className="size-[6px] rounded-full bg-[#ff5f57]" />
        <span className="size-[6px] rounded-full bg-[#febc2e]" />
        <span className="size-[6px] rounded-full bg-[#28c840]" />
      </div>
      {/* Content area */}
      <div
        className="flex flex-1"
        style={{ backgroundColor: colors.content }}
      >
        {/* Sidebar */}
        <div
          className="w-[30%] space-y-1 p-2"
          style={{ backgroundColor: colors.sidebar }}
        >
          <div
            className="h-1 w-3/4 rounded-full"
            style={{ backgroundColor: colors.bar }}
          />
          <div
            className="h-1 w-1/2 rounded-full"
            style={{ backgroundColor: colors.bar }}
          />
        </div>
        {/* Main */}
        <div className="flex-1 space-y-1.5 p-2">
          <div
            className="h-1.5 w-4/5 rounded-full"
            style={{ backgroundColor: colors.bar }}
          />
          <div
            className="h-1 w-full rounded-full"
            style={{ backgroundColor: colors.barMuted }}
          />
          <div
            className="h-1 w-3/5 rounded-full"
            style={{ backgroundColor: colors.barMuted }}
          />
        </div>
      </div>
    </div>
  );
}

const themeOptions = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "System" },
];

const fontOptions: { value: FontFamily; label: string; preview: string }[] = [
  { value: "geist-sans", label: "Geist Sans", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "inter", label: "Inter", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "plus-jakarta-sans", label: "Plus Jakarta Sans", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "dm-sans", label: "DM Sans", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "system-ui", label: "System", preview: "The quick brown fox jumps over the lazy dog" },
];

const fontFamilyMap: Record<FontFamily, string> = {
  "geist-sans": "var(--font-sans)",
  "inter": "var(--font-inter)",
  "plus-jakarta-sans": "var(--font-plus-jakarta-sans)",
  "dm-sans": "var(--font-dm-sans)",
  "system-ui": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const currentFont = user?.preferences?.fontFamily ?? "geist-sans";
  const [saving, setSaving] = useState(false);

  const handleFontChange = async (fontFamily: FontFamily) => {
    if (fontFamily === currentFont || saving) return;
    setSaving(true);
    try {
      const updated = await api.updateMe({ preferences: { fontFamily } });
      setUser(updated);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update font");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Theme</h2>
        <div className="flex gap-6" role="radiogroup" aria-label="Theme">
          {themeOptions.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={active}
                aria-label={`Select ${opt.label} theme`}
                onClick={() => setTheme(opt.value)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    "aspect-[4/3] w-36 overflow-hidden rounded-lg ring-1 transition-all",
                    active
                      ? "ring-2 ring-brand"
                      : "ring-border hover:ring-2 hover:ring-border"
                  )}
                >
                  {opt.value === "system" ? (
                    <div className="relative h-full w-full">
                      <WindowMockup
                        variant="light"
                        className="absolute inset-0"
                      />
                      <WindowMockup
                        variant="dark"
                        className="absolute inset-0 [clip-path:inset(0_0_0_50%)]"
                      />
                    </div>
                  ) : (
                    <WindowMockup variant={opt.value} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Font</h2>
        <div className="grid gap-2" role="radiogroup" aria-label="Font family">
          {fontOptions.map((opt) => {
            const active = currentFont === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={active}
                aria-label={`Select ${opt.label} font`}
                disabled={saving}
                onClick={() => handleFontChange(opt.value)}
                className={cn(
                  "flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all",
                  active
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-foreground/20"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div
                    className="mt-1 truncate text-xs text-muted-foreground"
                    style={{ fontFamily: fontFamilyMap[opt.value] }}
                  >
                    {opt.preview}
                  </div>
                </div>
                <div
                  className={cn(
                    "size-4 shrink-0 rounded-full border-2 transition-colors",
                    active
                      ? "border-brand bg-brand"
                      : "border-muted-foreground/30"
                  )}
                >
                  {active && (
                    <div className="flex h-full items-center justify-center">
                      <div className="size-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
