export interface Feeding {
  id?: number;
  petId: number;
  petName?: string;
  fedAt: string;
  grams?: number;
  notes?: string;
}

export interface FeedingGroupedByDate {
  date: string;
  feedings: Feeding[];
}

export interface FeedingSummary {
  petId: number;
  totalFeedings: number;
  totalGrams: number;
  leftoverGrams: number;
}
