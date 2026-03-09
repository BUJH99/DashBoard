import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { CompanyTarget } from "../../dashboard/types";
import {
  bindLocationTileState,
  createLocationMap,
  createLocationTileLayer,
  disposeLocationMap,
  registerLocationMapResize,
  resetLeafletContainer,
  type LocationTileState,
} from "../map/leafletMapPrimitives";
import { syncCompanyMarkers } from "../map/leafletMarkerLayer";

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
  const [tileState, setTileState] = useState<LocationTileState>("loading");
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelectCompany);

  onSelectRef.current = onSelectCompany;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    resetLeafletContainer(container);

    const map = createLocationMap(container);
    const tileLayer = createLocationTileLayer();
    const cleanupTileState = bindLocationTileState(tileLayer, setTileState);
    const cleanupResize = registerLocationMapResize(map);

    mapRef.current = map;
    tileLayer.addTo(map);

    return () => {
      cleanupResize();
      cleanupTileState();
      disposeLocationMap(container, map, tileLayer, markersRef.current);
      mapRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    syncCompanyMarkers({
      map,
      companies,
      selectedCompanyId,
      markers: markersRef.current,
      onSelectCompany: (companyId) => onSelectRef.current(companyId),
    });
  }, [companies, selectedCompanyId]);

  return {
    tileState,
  };
}
