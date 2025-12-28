import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddFeedingModal } from '../../components/add-feeding-modal/add-feeding-modal';
import { BackButton } from '../../components/back-button/back-button';
import { Feeding, FeedingGroupedByDate } from '../../models/feeding.model';
import { Pet } from '../../models/pet.model';
import { FeedingsSumPipe } from '../../pipes/feedings-sum.pipe';
import { FeedingApiService } from '../../services/feeding-api.service';
import { PetApiService } from '../../services/pet-api.service';
import { ScrollTrackerDirective } from '../../directives/scroll-tracker.directive';

@Component({
  selector: 'app-feedings',
  imports: [CommonModule, FormsModule, BackButton, AddFeedingModal, FeedingsSumPipe, ScrollTrackerDirective],
  providers: [DatePipe],
  templateUrl: './feedings.html',
  styleUrl: './feedings.scss',
})
export class Feedings implements OnInit {
  private feedingApiService = inject(FeedingApiService);
  private petApiService = inject(PetApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  pets: Pet[] = [];
  feedingsByDate: FeedingGroupedByDate[] = [];
  allFeedings: Feeding[] = [];
  isLoading = false;
  errorMessage = '';
  showModal = this.route.snapshot.queryParamMap.get('openModal') === 'true';
  selectedPetId = +this.route.snapshot.queryParamMap.get('petId')! || null;
  editingFeeding: Feeding | null = null;
  hasLoadedHistory = false;
  hasMoreHistory = true;

  currentStartDate: Date = new Date();
  currentEndDate: Date = new Date();

  ngOnInit(): void {
    this.resetDates();
    this.loadPets();
    
    // Check for petId query param
    const petIdParam = this.route.snapshot.queryParamMap.get('petId');
    if (petIdParam) {
      this.selectedPetId = +petIdParam;
    }
  }

  resetDates(): void {
    this.currentEndDate = new Date();
    this.currentStartDate = new Date();
    this.currentStartDate.setHours(0, 0, 0, 0);
    this.hasLoadedHistory = false;
    this.hasMoreHistory = true;
  }

  loadPets(): void {
    this.isLoading = true;
    this.petApiService.getAll().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
        if (pets.length > 0) {
          // Use query param petId if provided, otherwise use first pet
          if (!this.selectedPetId) {
            this.selectedPetId = pets[0].id || null;
          }
          if (this.selectedPetId) {
            this.loadFeedingsForPet(this.selectedPetId);
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load pets';
        this.isLoading = false;
      },
    });
  }

  loadFeedingsForPet(petId: number, append: boolean = false): void {
    this.isLoading = true;

    const request$ = append
      ? this.feedingApiService.getAllForPet(petId, {
          startDate: this.datePipe.transform(this.currentStartDate, 'yyyy-MM-ddTHH:mm:ss')!,
          endDate: this.datePipe.transform(this.currentEndDate, 'yyyy-MM-ddTHH:mm:ss')!,
        })
      : this.feedingApiService.getTodayForPet(petId);

    request$.subscribe({
      next: (feedings) => {
        const pet = this.pets.find(({ id }) => id === petId);
        const feedingsWithPetName = feedings.map((feeding) => ({
          ...feeding,
          petName: pet?.name,
        }));

        if (append) {
          if (feedings.length === 0) {
            this.hasMoreHistory = false;
          }
          const existingIds = new Set(this.allFeedings.map((f) => f.id));
          const newFeedings = feedingsWithPetName.filter(
            (f) => !f.id || !existingIds.has(f.id)
          );
          this.allFeedings = [...this.allFeedings, ...newFeedings];
        } else {
          this.allFeedings = feedingsWithPetName;
        }

        this.groupFeedingsByDate(this.allFeedings);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load feedings';
        this.isLoading = false;
      },
    });
  }

  loadPreviousWeek(): void {
    if (this.isLoading || !this.hasMoreHistory) return;
    this.hasLoadedHistory = true;
    const newEndDate = new Date(this.currentStartDate);

    const newStartDate = new Date(newEndDate);
    newStartDate.setDate(newStartDate.getDate() - 7);

    this.currentStartDate = newStartDate;
    this.currentEndDate = newEndDate;

    if (this.selectedPetId) {
      this.loadFeedingsForPet(this.selectedPetId, true);
    }
  }

  onPetFilterChange(): void {
    if (this.selectedPetId) {
      this.resetDates();
      this.loadFeedingsForPet(this.selectedPetId);
    }
  }

  groupFeedingsByDate(feedings: Feeding[]): void {
    const sorted = feedings.sort((a, b) =>
      new Date(b.fedAt).getTime() - new Date(a.fedAt).getTime()
    );

    const grouped = new Map<string, Feeding[]>();
    sorted.forEach((feeding) => {
      const date = new Date(feeding.fedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(feeding);
    });

    this.feedingsByDate = Array.from(grouped.entries()).map(([date, feedings]) => ({
      date,
      feedings,
    }));
  }

  openModal(): void {
    if (this.pets.length === 0) {
      this.errorMessage = 'Please add a pet first';
      return;
    }
    this.editingFeeding = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingFeeding = null;
  }

  onFeedingAdded(feeding: Feeding): void {
    this.isLoading = true;
    this.feedingApiService.create(feeding.petId, feeding).subscribe({
      next: (createdFeeding) => {
        this.showModal = false;
        this.editingFeeding = null;
        this.isLoading = false;

        const pet = this.pets.find(({ id }) => id === createdFeeding.petId);
        const newFeeding = { ...createdFeeding, petName: pet?.name };

        this.allFeedings = [...this.allFeedings, newFeeding];
        this.groupFeedingsByDate(this.allFeedings);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add feeding';
        this.isLoading = false;
      },
    });
  }

  onFeedingUpdated(feeding: Feeding): void {
    if (!this.editingFeeding?.id) return;
    
    this.isLoading = true;
    this.feedingApiService.update(feeding.petId, this.editingFeeding.id, feeding).subscribe({
      next: (updatedFeeding) => {
        this.showModal = false;
        this.editingFeeding = null;
        this.isLoading = false;

        const pet = this.pets.find(({ id }) => id === updatedFeeding.petId);
        const updatedFeedingWithPet = { ...updatedFeeding, petName: pet?.name };

        this.allFeedings = this.allFeedings.map((existingFeeding) =>
          existingFeeding.id === updatedFeeding.id ? updatedFeedingWithPet : existingFeeding
        );
        this.groupFeedingsByDate(this.allFeedings);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update feeding';
        this.isLoading = false;
      },
    });
  }

  onFeedingDeleted(feeding: Feeding): void {
    if (!feeding.id) return;

    this.isLoading = true;
    this.feedingApiService.delete(feeding.petId, feeding.id).subscribe({
      next: () => {
        this.showModal = false;
        this.editingFeeding = null;
        this.isLoading = false;

        this.allFeedings = this.allFeedings.filter((existingFeeding) => existingFeeding.id !== feeding.id);
        this.groupFeedingsByDate(this.allFeedings);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete feeding';
        this.isLoading = false;
      },
    });
  }

  editFeeding(feeding: Feeding): void {
    this.editingFeeding = feeding;
    this.showModal = true;
  }

  formatTime(fedAt: string): string {
    return new Date(fedAt).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
