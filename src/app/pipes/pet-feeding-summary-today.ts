import { Pipe, PipeTransform } from '@angular/core';
import { Feeding, FeedingSummary } from '../models/feeding.model';
import { FeedingApiService } from '../services/feeding-api.service';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'petFeedingSummaryToday',
  standalone: true,
})
export class PetFeedingSummaryTodayPipe implements PipeTransform {
  constructor(
    private feedingApiService: FeedingApiService,
  ) {}

  transform(petId: number, dailyPortion: number): Observable<FeedingSummary> {
    return this.feedingApiService.getTodayForPet(petId, true).pipe(
      map((feedings) => this.getSummaryForFeedings(feedings, petId, dailyPortion)),
    );
  }

  private getSummaryForFeedings(feedings: Feeding[], petId: number, dailyPortion: number): FeedingSummary {
    const totalFeedings = feedings.length;
    const totalGrams = feedings.reduce((sum, feeding) => sum + (feeding.grams || 0), 0);
    const leftoverGrams = Math.max(0, dailyPortion - totalGrams);

    return {
      petId,
      totalFeedings,
      totalGrams,
      leftoverGrams,
    };
  }
}
