import { useState } from "react";
import type { DashboardController } from "../useDashboardController";
import { sanitizeDashboardBannerMessage } from "../config/dashboardChrome";
import { CommuteMemoEditorSection } from "./location/CommuteMemoEditorSection";
import { CompanyMemoListSection } from "./location/CompanyMemoListSection";
import { LocationMapSection } from "./location/LocationMapSection";
import { RouteLauncherSection } from "./location/RouteLauncherSection";
import { OfferCompanyMetricsSection } from "./offer/OfferCompanyMetricsSection";
import { OfferRadarSection } from "./offer/OfferRadarSection";

export function OfferTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6">
      <OfferCompanyMetricsSection offer={controller.offer} />
      <OfferRadarSection offer={controller.offer} />
    </div>
  );
}

export function LocationTab({ controller }: { controller: DashboardController }) {
  const [routeSearchError, setRouteSearchError] = useState<string | null>(null);
  const dashboardStateMessage = sanitizeDashboardBannerMessage(controller.dashboardStateMessage);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
      <CompanyMemoListSection
        companies={controller.companies}
        companyCommuteNotes={controller.dashboardState.location.companyCommuteNotes}
      />

      <div className="grid gap-6">
        <LocationMapSection companies={controller.companies} />
        <CommuteMemoEditorSection
          selectedCompany={controller.companies.selectedCompany}
          location={controller.location}
          dashboardStateMessage={dashboardStateMessage}
          onSaveDashboardState={() => void controller.saveDashboardState()}
        />
        <RouteLauncherSection
          location={controller.location}
          selectedCompanyName={controller.companies.selectedCompany.name}
          routeSearchError={routeSearchError}
          setRouteSearchError={setRouteSearchError}
        />
      </div>
    </div>
  );
}
