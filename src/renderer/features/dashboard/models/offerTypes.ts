export type OfferProfile = {
  salary: number;
  growth: number;
  wlb: number;
  location: number;
  culture: number;
  base: string;
  bonus: string;
};

export type OriginPreset = {
  label: string;
  value: string;
  lat: number | null;
  lng: number | null;
  type: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
};

export type OfferCatalogEntry = {
  id: string;
  label: string;
  companyId: number | null;
  profile: OfferProfile;
  notes: string[];
};
