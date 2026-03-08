import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { CompanyTarget } from "../../dashboard/types";

type UseLeafletLocationMapOptions = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  companies: CompanyTarget[];
  selectedCompanyId: number;
  onSelectCompany: (id: number) => void;
};

export function useLeafletLocationMap({
  containerRef,
  companies,
  selectedCompanyId,
  onSelectCompany,
}: UseLeafletLocationMapOptions) {
  const [tileState, setTileState] = useState<"loading" | "ready" | "error">("loading");
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelectCompany);

  onSelectRef.current = onSelectCompany;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    if ((container as L.DomUtil & { _leaflet_id?: number })._leaflet_id) {
      (container as L.DomUtil & { _leaflet_id?: number })._leaflet_id = undefined;
    }

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    }).setView([36.5, 127.8], 7);
    mapRef.current = map;

    let sawSuccessfulTile = false;
    let tileErrorCount = 0;
    const tileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
      crossOrigin: true,
    });
    tileLayerRef.current = tileLayer;

    tileLayer.on("loading", () => {
      setTileState("loading");
    });
    tileLayer.on("load", () => {
      sawSuccessfulTile = true;
      setTileState("ready");
    });
    tileLayer.on("tileerror", () => {
      tileErrorCount += 1;
      if (!sawSuccessfulTile && tileErrorCount >= 1) {
        setTileState("error");
      }
    });
    tileLayer.on("tileload", () => {
      sawSuccessfulTile = true;
      setTileState("ready");
    });
    tileLayer.addTo(map);

    const resizeMap = () => map.invalidateSize();
    requestAnimationFrame(resizeMap);
    const resizeTimeout = window.setTimeout(resizeMap, 160);
    window.addEventListener("resize", resizeMap);

    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeMap);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      tileLayer.remove();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      container.innerHTML = "";
    };
  }, [containerRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const buildMarkerIcon = (company: CompanyTarget, selected: boolean) => {
      const color = company.location.includes("?쒖슱")
        ? "#3b82f6"
        : company.location.includes("寃쎄린")
          ? "#10b981"
          : "#f59e0b";
      const size = selected ? 18 : 14;
      const ring = selected ? 5 : 4;
      return L.divIcon({
        className: "dashboard-marker-icon",
        html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:${ring}px solid white;box-shadow:0 8px 20px rgba(15,23,42,.18)"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    companies.forEach((company) => {
      const marker = L.marker([company.lat, company.lng], {
        icon: buildMarkerIcon(company, company.id === selectedCompanyId),
      }).addTo(map);
      marker.bindPopup(
        `<div style="font-weight:700;font-size:12px">${company.name}<br /><span style="font-weight:500;color:#64748b">${company.location}</span></div>`,
      );
      marker.on("click", () => onSelectRef.current(company.id));
      markersRef.current.set(company.id, marker);
    });

    const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0];
    const selectedMarker = markersRef.current.get(selectedCompanyId);
    if (selectedCompany && selectedMarker) {
      map.setView([selectedCompany.lat, selectedCompany.lng], 9, { animate: false });
      selectedMarker.openPopup();
    }
  }, [companies, selectedCompanyId]);

  return {
    tileState,
  };
}
