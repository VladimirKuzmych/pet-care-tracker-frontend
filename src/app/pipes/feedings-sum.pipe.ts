import { Pipe, PipeTransform } from '@angular/core';
import { Feeding } from '../models/feeding.model';

@Pipe({
  name: 'feedingsSum',
  standalone: true,
})
export class FeedingsSumPipe implements PipeTransform {
  transform(feedings: Feeding[]): number {
    return feedings.reduce((sum, feeding) => sum + (feeding.grams || 0), 0);
  }
}
