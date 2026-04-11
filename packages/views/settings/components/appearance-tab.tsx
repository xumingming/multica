"use client";

import { useState } from "react";
import { useTheme } from "@multica/ui/components/common/theme-provider";
import { cn } from "@multica/ui/lib/utils";
import { useAuthStore } from "@multica/core/auth";
import { api } from "@multica/core/api";
import { toast } from "sonner";
import type { FontFamily, CodeFontFamily } from "@multica/core/types";

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

const fontOptions: { value: FontFamily; label: string; description: string }[] = [
  { value: "geist-sans", label: "Geist Sans", description: "Clean, modern sans-serif — the default" },
  { value: "inter", label: "Inter", description: "Highly legible, widely used in web apps" },
  { value: "plus-jakarta-sans", label: "Plus Jakarta Sans", description: "Geometric, modern feel" },
  { value: "dm-sans", label: "DM Sans", description: "Clean and minimal contemporary style" },
  { value: "system-ui", label: "System", description: "Uses your operating system's default font" },
];

const codeFontOptions: { value: CodeFontFamily; label: string; description: string }[] = [
  { value: "geist-mono", label: "Geist Mono", description: "Matches the default UI style" },
  { value: "fira-code", label: "Fira Code", description: "Popular with ligatures support" },
  { value: "jetbrains-mono", label: "JetBrains Mono", description: "Designed for developers" },
  { value: "source-code-pro", label: "Source Code Pro", description: "Adobe's classic monospace" },
  { value: "system-mono", label: "System Mono", description: "Uses your OS default monospace font" },
];

const fontFamilyMap: Record<FontFamily, string> = {
  "geist-sans": "var(--font-sans)",
  "inter": "var(--font-inter)",
  "plus-jakarta-sans": "var(--font-plus-jakarta-sans)",
  "dm-sans": "var(--font-dm-sans)",
  "system-ui": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const codeFontFamilyMap: Record<CodeFontFamily, string> = {
  "geist-mono": "var(--font-mono)",
  "fira-code": "var(--font-fira-code)",
  "jetbrains-mono": "var(--font-jetbrains-mono)",
  "source-code-pro": "var(--font-source-code-pro)",
  "system-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
};

function FontRadioOption<T extends string>({
  value,
  label,
  description,
  fontStyle,
  active,
  disabled,
  onSelect,
  previewText,
}: {
  value: T;
  label: string;
  description: string;
  fontStyle: string;
  active: boolean;
  disabled: boolean;
  onSelect: (v: T) => void;
  previewText: string;
}) {
  return (
    <button
      role="radio"
      aria-checked={active}
      aria-label={`Select ${label} font`}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={cn(
        "flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all",
        active
          ? "border-brand bg-brand/5"
          : "border-border hover:border-foreground/20"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <div
          className="mt-1.5 truncate text-sm text-foreground/70"
          style={{ fontFamily: fontStyle }}
        >
          {previewText}
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
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const currentFont = user?.preferences?.fontFamily ?? "geist-sans";
  const currentCodeFont = user?.preferences?.codeFontFamily ?? "geist-mono";
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

  const handleCodeFontChange = async (codeFontFamily: CodeFontFamily) => {
    if (codeFontFamily === currentCodeFont || saving) return;
    setSaving(true);
    try {
      const updated = await api.updateMe({ preferences: { codeFontFamily } });
      setUser(updated);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update code font");
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
        <h2 className="text-sm font-semibold">Interface Font</h2>
        <p className="text-xs text-muted-foreground">The font used for all UI text — menus, labels, and descriptions.</p>
        <div className="grid gap-2" role="radiogroup" aria-label="Interface font">
          {fontOptions.map((opt) => (
            <FontRadioOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              fontStyle={fontFamilyMap[opt.value]}
              active={currentFont === opt.value}
              disabled={saving}
              onSelect={handleFontChange}
              previewText="Assign tasks, track progress, ship together."
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Code Font</h2>
        <p className="text-xs text-muted-foreground">The monospace font used for code blocks, inline code, and editors.</p>
        <div className="grid gap-2" role="radiogroup" aria-label="Code font">
          {codeFontOptions.map((opt) => (
            <FontRadioOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              fontStyle={codeFontFamilyMap[opt.value]}
              active={currentCodeFont === opt.value}
              disabled={saving}
              onSelect={handleCodeFontChange}
              previewText="const task = await agent.run(issue);"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
