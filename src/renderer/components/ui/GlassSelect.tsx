import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export type GlassSelectOption = {
  value: string;
  label: string;
};

type GlassSelectTone =
  | "slate"
  | "cyan"
  | "blue"
  | "emerald"
  | "amber"
  | "violet";

type GlassSelectSize = "sm" | "md" | "lg";

const TONE_STYLES: Record<
  GlassSelectTone,
  {
    label: string;
    triggerBorder: string;
    triggerGlow: string;
    triggerText: string;
    menuBorder: string;
    menuRing: string;
    selectedRow: string;
    selectedText: string;
    icon: string;
  }
> = {
  slate: {
    label: "text-slate-700",
    triggerBorder: "border-slate-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(148,163,184,0.22),0_16px_30px_rgba(148,163,184,0.12)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-slate-300/85 bg-white/30",
    selectedText: "text-slate-800",
    icon: "text-slate-500",
  },
  cyan: {
    label: "text-slate-700",
    triggerBorder: "border-cyan-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(34,211,238,0.24),0_16px_30px_rgba(6,182,212,0.10)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-cyan-200/85 bg-white/30",
    selectedText: "text-cyan-700",
    icon: "text-cyan-500",
  },
  blue: {
    label: "text-slate-700",
    triggerBorder: "border-blue-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(96,165,250,0.28),0_16px_30px_rgba(59,130,246,0.10)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-blue-200/85 bg-white/30",
    selectedText: "text-blue-700",
    icon: "text-blue-500",
  },
  emerald: {
    label: "text-slate-700",
    triggerBorder: "border-emerald-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(52,211,153,0.24),0_16px_30px_rgba(16,185,129,0.10)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-emerald-200/85 bg-white/30",
    selectedText: "text-emerald-700",
    icon: "text-emerald-500",
  },
  amber: {
    label: "text-slate-700",
    triggerBorder: "border-amber-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(251,191,36,0.24),0_16px_30px_rgba(245,158,11,0.10)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-amber-200/85 bg-white/30",
    selectedText: "text-amber-700",
    icon: "text-amber-500",
  },
  violet: {
    label: "text-slate-700",
    triggerBorder: "border-violet-200/90",
    triggerGlow: "shadow-[0_0_0_1px_rgba(167,139,250,0.26),0_16px_30px_rgba(139,92,246,0.10)]",
    triggerText: "text-slate-800",
    menuBorder: "border-slate-200/80",
    menuRing: "ring-1 ring-white/70",
    selectedRow: "border-violet-200/85 bg-white/30",
    selectedText: "text-violet-700",
    icon: "text-violet-500",
  },
};

const SIZE_STYLES: Record<
  GlassSelectSize,
  {
    trigger: string;
    menu: string;
    option: string;
  }
> = {
  sm: {
    trigger: "rounded-[20px] px-4 py-3 text-sm font-semibold",
    menu: "rounded-[24px]",
    option: "px-4 py-3 text-[15px]",
  },
  md: {
    trigger: "rounded-[22px] px-4 py-3.5 text-base font-semibold",
    menu: "rounded-[26px]",
    option: "px-5 py-3.5 text-base",
  },
  lg: {
    trigger: "rounded-[26px] px-5 py-4 text-[28px] font-black tracking-tight",
    menu: "rounded-[28px]",
    option: "px-6 py-4 text-[19px]",
  },
};

type GlassSelectProps = {
  label?: string;
  ariaLabel?: string;
  value: string;
  options: GlassSelectOption[];
  onChange: (value: string) => void;
  tone?: GlassSelectTone;
  size?: GlassSelectSize;
  className?: string;
  icon?: ReactNode;
  menuMaxHeightClassName?: string;
};

export function GlassSelect({
  label,
  ariaLabel,
  value,
  options,
  onChange,
  tone = "slate",
  size = "md",
  className,
  icon,
  menuMaxHeightClassName = "max-h-[280px]",
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const selectedOption = options.find((item) => item.value === value) ?? options[0];
  const toneStyle = TONE_STYLES[tone];
  const sizeStyle = SIZE_STYLES[size];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={cn("relative grid gap-2", className)}>
      {label ? (
        <p className={cn("text-sm font-black tracking-tight", toneStyle.label)}>{label}</p>
      ) : null}

      <button
        type="button"
        aria-label={ariaLabel ?? label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "group relative border border-slate-200/80 bg-white/52 text-left shadow-[0_12px_28px_rgba(148,163,184,0.10)] backdrop-blur-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/58 active:translate-y-[1px]",
          sizeStyle.trigger,
          isOpen && cn("translate-y-[-2px]", toneStyle.triggerBorder, toneStyle.triggerGlow),
        )}
      >
        <span className="flex items-center justify-between gap-4">
          <span className="flex min-w-0 items-center gap-3">
            {icon ? (
              <span className={cn("shrink-0", isOpen ? toneStyle.icon : "text-slate-500")}>
                {icon}
              </span>
            ) : null}
            <span className={cn("truncate", toneStyle.triggerText)}>
              {selectedOption?.label}
            </span>
          </span>
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/70 bg-white/42 transition-all duration-200 group-hover:scale-105 group-hover:bg-white/52",
              isOpen && "border-white/70 bg-white/58",
            )}
          >
            <ChevronDown
              className={cn(
                "h-4.5 w-4.5 transition-transform duration-200",
                isOpen ? toneStyle.icon : "text-slate-500",
                isOpen && "rotate-180",
              )}
            />
          </span>
        </span>
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+12px)] z-20 origin-top overflow-hidden border bg-white/56 shadow-[0_24px_54px_rgba(148,163,184,0.16)] backdrop-blur-[22px] transition-all duration-200",
          sizeStyle.menu,
          toneStyle.menuBorder,
          toneStyle.menuRing,
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? label}
          className={cn(
            "relative overflow-y-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            menuMaxHeightClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "mx-2 flex w-[calc(100%-16px)] items-center justify-between gap-4 rounded-[18px] border border-transparent text-left transition duration-150",
                  sizeStyle.option,
                  isSelected ? toneStyle.selectedRow : "text-slate-700 hover:bg-white/70",
                )}
              >
                <span
                  className={cn(
                    "truncate font-semibold tracking-tight",
                    isSelected ? toneStyle.selectedText : "text-slate-700",
                  )}
                >
                  {option.label}
                </span>
                <Check
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-opacity",
                    toneStyle.icon,
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
