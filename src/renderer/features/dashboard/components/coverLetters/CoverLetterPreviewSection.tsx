import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { SurfaceCard } from "../../../../components/ui/primitives";
import { renderMarkdown } from "../../../../lib/renderMarkdown";

type CoverLetterPreviewSectionProps = {
  content: string;
};

export function CoverLetterPreviewSection({
  content,
}: CoverLetterPreviewSectionProps) {
  return (
    <SurfaceCard className="h-full overflow-hidden p-6 xl:sticky xl:top-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900">미리보기</h3>
      <ScrollArea className="h-[820px] pr-3">
        <div className="prose prose-slate max-w-none text-sm">{renderMarkdown(content)}</div>
      </ScrollArea>
    </SurfaceCard>
  );
}
