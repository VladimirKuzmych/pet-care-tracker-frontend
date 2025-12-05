import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedingApiService } from '../../services/feeding-api.service';
import { PetApiService } from '../../services/pet-api.service';
import { Feeding, FeedingGroupedByDate } from '../../models/feeding.model';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-feedings',
  imports: [CommonModule, FormsModule],
  templateUrl: './feedings.html',
  styleUrl: './feedings.scss',
})
export class Feedings implements OnInit, AfterViewInit {
  private feedingApiService = inject(FeedingApiService);
  private petApiService = inject(PetApiService);
  private router = inject(Router);

  @ViewChild('gramsInput') gramsInput?: ElementRef<HTMLInputElement>;

  pets: Pet[] = [];
  feedingsByDate: FeedingGroupedByDate[] = [];
  isLoading = false;
  errorMessage = '';
  showModal = false;
  selectedPetId = '';

  newFeeding: Feeding = {
    petId: '',
    fedAt: this.getLocalDateTimeString(),
    notes: '',
  };

  ngOnInit(): void {
    this.loadPets();
  }

  ngAfterViewInit(): void {
    if (this.showModal) {
      setTimeout(() => {
        this.gramsInput?.nativeElement.focus();
      }, 0);
    }
  }

  loadPets(): void {
    this.isLoading = true;
    this.petApiService.getAll().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
        if (pets.length > 0) {
          this.selectedPetId = pets[0].id || '';
          this.loadFeedingsForPet(this.selectedPetId);
          this.openModal();
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

  loadFeedingsForPet(petId: string): void {
    if (!petId) return;
    
    this.isLoading = true;
    this.feedingApiService.getAllForPet(petId).subscribe({
      next: (feedings) => {
        const pet = this.pets.find(p => p.id === petId);
        const feedingsWithPetName = feedings.map(feeding => ({
          ...feeding,
          petName: pet?.name,
        }));
        this.groupFeedingsByDate(feedingsWithPetName);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load feedings';
        this.isLoading = false;
      },
    });
  }

  onPetFilterChange(): void {
    this.loadFeedingsForPet(this.selectedPetId);
  }

  groupFeedingsByDate(feedings: Feeding[]): void {
    const sorted = feedings.sort((a, b) =>
      new Date(b.fedAt).getTime() - new Date(a.fedAt).getTime()
    );

    const grouped = new Map<string, Feeding[]>();
    sorted.forEach((feeding) => {
      const date = new Date(feeding.fedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
    this.showModal = true;
    this.newFeeding = {
      petId: this.pets[0].id || '',
      fedAt: this.getLocalDateTimeString(),
      notes: '',
    };
    setTimeout(() => {
      this.gramsInput?.nativeElement.focus();
    }, 0);
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = '';
  }

  getLocalDateTimeString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submitFeeding(): void {
    if (!this.newFeeding.petId) {
      this.errorMessage = 'Please select a pet';
      return;
    }

    this.isLoading = true;
    
    this.feedingApiService.create(this.newFeeding.petId, this.newFeeding).subscribe({
      next: () => {
        this.closeModal();
        this.loadFeedingsForPet(this.selectedPetId);
      },
      error: (error) => {
        this.errorMessage = 'Failed to add feeding';
        this.isLoading = false;
      },
    });
  }

  formatTime(fedAt: string): string {
    return new Date(fedAt).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
