import { GlassSelect, type GlassSelectOption } from "../../../../components/ui/GlassSelect";

type OfferGlassSelectProps = {
  label: string;
  value: string;
  options: GlassSelectOption[];
  onChange: (value: string) => void;
  tone: "blue" | "emerald";
};

export function OfferGlassSelect({
  label,
  value,
  options,
  onChange,
  tone,
}: OfferGlassSelectProps) {
  return (
    <GlassSelect
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      tone={tone}
      size="lg"
    />
  );
}
