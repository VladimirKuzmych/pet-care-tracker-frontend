import { Pipe, PipeTransform } from '@angular/core';
import { FeedingSummary } from '../models/feeding.model';
import { FeedingApiService } from '../services/feeding-api.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'petFeedingSummaryToday',
  standalone: true,
})
export class PetFeedingSummaryTodayPipe implements PipeTransform {
  constructor(
    private feedingApiService: FeedingApiService,
  ) {}

  transform(petId: number): Observable<FeedingSummary> {
    return this.feedingApiService.getPetTodaySummary(petId);
  }
}
