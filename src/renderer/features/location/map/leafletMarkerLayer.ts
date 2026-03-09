import L from "leaflet";
import type { CompanyTarget } from "../../dashboard/types";

const MARKER_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function clearCompanyMarkers(markers: Map<number, L.Marker>) {
  markers.forEach((marker) => marker.remove());
  markers.clear();
}

export function buildCompanyMarkerIcon(company: CompanyTarget, selected: boolean) {
  const color = MARKER_COLORS[company.id % MARKER_COLORS.length];
  const size = selected ? 18 : 14;
  const ring = selected ? 5 : 4;

  return L.divIcon({
    className: "dashboard-marker-icon",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:${ring}px solid white;box-shadow:0 8px 20px rgba(15,23,42,.18)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function buildCompanyMarkerPopup(company: CompanyTarget) {
  return `<div style="font-weight:700;font-size:12px">${company.name}<br /><span style="font-weight:500;color:#64748b">${company.location}</span></div>`;
}

export function syncCompanyMarkers({
  map,
  companies,
  selectedCompanyId,
  markers,
  onSelectCompany,
}: {
  map: L.Map;
  companies: CompanyTarget[];
  selectedCompanyId: number;
  markers: Map<number, L.Marker>;
  onSelectCompany: (id: number) => void;
}) {
  clearCompanyMarkers(markers);

  companies.forEach((company) => {
    const marker = L.marker([company.lat, company.lng], {
      icon: buildCompanyMarkerIcon(company, company.id === selectedCompanyId),
    }).addTo(map);

    marker.bindPopup(buildCompanyMarkerPopup(company));
    marker.on("click", () => onSelectCompany(company.id));
    markers.set(company.id, marker);
  });

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0];
  if (!selectedCompany) {
    return;
  }

  const selectedMarker = markers.get(selectedCompany.id);
  if (!selectedMarker) {
    return;
  }

  map.setView([selectedCompany.lat, selectedCompany.lng], 9, { animate: false });
  selectedMarker.openPopup();
}
