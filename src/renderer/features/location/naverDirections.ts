export function projectToNaverWebXY(lat: number, lng: number) {
  const originShift = 6378137;
  const x = originShift * ((lng * Math.PI) / 180);
  const y = originShift * Math.log(Math.tan(Math.PI / 4 + ((lat * Math.PI) / 180) / 2));
  return {
    x: x.toFixed(6),
    y: y.toFixed(6),
  };
}

export function buildNaverDirectionSegment({
  placeName,
  type = "ADDRESS_POI",
  lat,
  lng,
}: {
  placeName: string;
  type?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  lat?: number | null;
  lng?: number | null;
}) {
  const projected = typeof lat === "number" && typeof lng === "number" ? projectToNaverWebXY(lat, lng) : null;
  const x = projected ? projected.x : "-";
  const y = projected ? projected.y : "-";
  return `${x},${y},${encodeURIComponent(placeName)},,${type}`;
}

export function buildNaverTransitDirectionsUrl({
  origin,
  originLat,
  originLng,
  originType,
  destination,
  destinationLat,
  destinationLng,
}: {
  origin: string;
  originLat?: number | null;
  originLng?: number | null;
  originType?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  destination: string;
  destinationLat?: number | null;
  destinationLng?: number | null;
}) {
  const originSegment = buildNaverDirectionSegment({
    placeName: origin,
    type: originType ?? "ADDRESS_POI",
    lat: originLat,
    lng: originLng,
  });
  const destinationSegment = buildNaverDirectionSegment({
    placeName: destination,
    type: "PLACE_POI",
    lat: destinationLat,
    lng: destinationLng,
  });
  return `https://map.naver.com/p/directions/${originSegment}/${destinationSegment}/-/transit?c=15.00,0,0,0,dh`;
}
