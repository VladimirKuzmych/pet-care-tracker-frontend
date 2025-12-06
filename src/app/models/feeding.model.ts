export interface Feeding {
  id?: string;
  petId: string;
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
  petName: string;
  date: string;
  totalFeedings: number;
  totalGrams: number;
  averageGramsPerFeeding: number;
}
