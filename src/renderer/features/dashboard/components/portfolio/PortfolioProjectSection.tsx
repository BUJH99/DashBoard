import { ArrowUpRight } from "lucide-react";
import { Pill } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioProjectSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioProjectSection({
  portfolio,
}: PortfolioProjectSectionProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {portfolio.data.projects.map((project) => (
        <article
          key={project.id}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(148,163,184,0.10)]"
        >
          <h3 className="text-[16px] font-black leading-snug text-slate-900">{project.name}</h3>
          <p className="mt-2 text-[12px] font-semibold text-slate-400">
            {project.date} · <span className="text-blue-600">{project.role}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Pill key={tech} className="border-slate-200 bg-slate-100 text-slate-700">
                {tech}
              </Pill>
            ))}
          </div>
          <p className="mt-5 text-[14px] leading-7 text-slate-500">{project.impact}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-cyan-600 transition hover:text-cyan-700"
          >
            프로젝트 링크
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </article>
      ))}
    </div>
  );
}
