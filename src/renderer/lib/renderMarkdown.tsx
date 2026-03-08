import React from "react";

export function renderMarkdown(markdown: string) {
  const blocks: React.ReactNode[] = [];
  const lines = markdown.split("\n");
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    blocks.push(
      <ul key={`list-${blocks.length}`} className="mb-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith("# ")) {
      flushList();
      blocks.push(
        <h1 key={`h1-${index}`} className="mb-6 break-words border-b border-slate-200 pb-3 text-[34px] font-black tracking-tight text-slate-900">
          {line.replace("# ", "")}
        </h1>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${index}`} className="mb-3 mt-8 break-words text-[22px] font-bold text-slate-800">
          {line.replace("## ", "")}
        </h2>,
      );
      return;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.replace("- ", ""));
      return;
    }

    if (line.trim() === "") {
      flushList();
      return;
    }

    flushList();
    blocks.push(
      <p key={`p-${index}`} className="mb-3 break-words text-sm leading-relaxed text-slate-700">
        {line}
      </p>,
    );
  });

  flushList();
  return blocks;
}
