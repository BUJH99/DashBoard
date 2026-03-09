import { LeafletLocationMap } from "../../../location/components/LeafletLocationMap";
import type { DashboardController } from "../../useDashboardController";

type LocationMapSectionProps = {
  companies: DashboardController["companies"];
};

export function LocationMapSection({
  companies,
}: LocationMapSectionProps) {
  return (
    <LeafletLocationMap
      companies={companies.companyTargets}
      selectedCompanyId={companies.selectedCompany.id}
      onSelectCompany={companies.updateSelectedCompanyId}
    />
  );
}
