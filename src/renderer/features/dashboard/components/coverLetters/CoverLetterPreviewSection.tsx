import { SurfaceCard } from "../../../../components/ui/primitives";
import { renderMarkdown } from "../../../../lib/renderMarkdown";

type CoverLetterPreviewSectionProps = {
  content: string;
};

export function CoverLetterPreviewSection({
  content,
}: CoverLetterPreviewSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900">미리보기</h3>
      <div className="prose prose-slate max-w-none text-sm">{renderMarkdown(content)}</div>
    </SurfaceCard>
  );
}
