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
  placeId,
}: {
  placeName: string;
  type?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  lat?: number | null;
  lng?: number | null;
  placeId?: string | null;
}) {
  const projected = typeof lat === "number" && typeof lng === "number" ? projectToNaverWebXY(lat, lng) : null;
  const x = projected ? projected.x : "-";
  const y = projected ? projected.y : "-";
  return `${x},${y},${encodeURIComponent(placeName)},${placeId ?? ""},${type}`;
}

export function buildNaverTransitDirectionsUrl({
  origin,
  originLat,
  originLng,
  originType,
  originPlaceId,
  destination,
  destinationLat,
  destinationLng,
  destinationType,
  destinationPlaceId,
}: {
  origin: string;
  originLat?: number | null;
  originLng?: number | null;
  originType?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  originPlaceId?: string | null;
  destination: string;
  destinationLat?: number | null;
  destinationLng?: number | null;
  destinationType?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  destinationPlaceId?: string | null;
}) {
  const originSegment = buildNaverDirectionSegment({
    placeName: origin,
    type: originType ?? "ADDRESS_POI",
    lat: originLat,
    lng: originLng,
    placeId: originPlaceId,
  });
  const destinationSegment = buildNaverDirectionSegment({
    placeName: destination,
    type: destinationType ?? "ADDRESS_POI",
    lat: destinationLat,
    lng: destinationLng,
    placeId: destinationPlaceId,
  });
  return `https://map.naver.com/p/directions/${originSegment}/${destinationSegment}/-/transit/0?c=15.00,0,0,0,dh`;
}
