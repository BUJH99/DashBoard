import L from "leaflet";

export type LocationTileState = "loading" | "ready" | "error";

export type LeafletContainer = HTMLDivElement & { _leaflet_id?: number };

const INITIAL_CENTER: L.LatLngExpression = [36.5, 127.8];
const INITIAL_ZOOM = 7;
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_OPTIONS: L.TileLayerOptions = {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
  crossOrigin: true,
};

export function resetLeafletContainer(container: HTMLDivElement) {
  const leafletContainer = container as LeafletContainer;
  if (leafletContainer._leaflet_id) {
    leafletContainer._leaflet_id = undefined;
  }
}

export function createLocationMap(container: HTMLDivElement) {
  return L.map(container, {
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true,
  }).setView(INITIAL_CENTER, INITIAL_ZOOM);
}

export function createLocationTileLayer() {
  return L.tileLayer(TILE_URL, TILE_OPTIONS);
}

export function bindLocationTileState(
  tileLayer: L.TileLayer,
  setTileState: (state: LocationTileState) => void,
) {
  let sawSuccessfulTile = false;
  let tileErrorCount = 0;

  const handleLoading = () => {
    setTileState("loading");
  };
  const handleLoad = () => {
    sawSuccessfulTile = true;
    setTileState("ready");
  };
  const handleTileError = () => {
    tileErrorCount += 1;
    if (!sawSuccessfulTile && tileErrorCount >= 1) {
      setTileState("error");
    }
  };
  const handleTileLoad = () => {
    sawSuccessfulTile = true;
    setTileState("ready");
  };

  tileLayer.on("loading", handleLoading);
  tileLayer.on("load", handleLoad);
  tileLayer.on("tileerror", handleTileError);
  tileLayer.on("tileload", handleTileLoad);

  return () => {
    tileLayer.off("loading", handleLoading);
    tileLayer.off("load", handleLoad);
    tileLayer.off("tileerror", handleTileError);
    tileLayer.off("tileload", handleTileLoad);
  };
}

export function registerLocationMapResize(map: L.Map) {
  const resizeMap = () => map.invalidateSize();
  requestAnimationFrame(resizeMap);
  const resizeTimeout = window.setTimeout(resizeMap, 160);
  window.addEventListener("resize", resizeMap);

  return () => {
    window.clearTimeout(resizeTimeout);
    window.removeEventListener("resize", resizeMap);
  };
}

export function disposeLocationMap(
  container: HTMLDivElement,
  map: L.Map,
  tileLayer: L.TileLayer,
  markers: Map<number, L.Marker>,
) {
  markers.forEach((marker) => marker.remove());
  markers.clear();
  tileLayer.remove();
  map.remove();
  container.innerHTML = "";
}
