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
