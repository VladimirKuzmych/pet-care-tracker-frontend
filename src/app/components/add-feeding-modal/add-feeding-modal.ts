import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedingApiService } from '../../services/feeding-api.service';
import { Feeding } from '../../models/feeding.model';
import { Pet } from '../../models/pet.model';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-add-feeding-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './add-feeding-modal.html',
  styleUrl: './add-feeding-modal.scss',
})
export class AddFeedingModal implements OnChanges {
  private feedingApiService = inject(FeedingApiService);

  @Input() isOpen = false;
  @Input() selectedPetId: number | null = null;
  @Input() pets: Pet[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() feedingAdded = new EventEmitter<void>();

  @ViewChild('gramsInput') gramsInput?: ElementRef<HTMLInputElement>;

  isLoading = false;
  errorMessage = '';

  feeding: Feeding = {
    petId: 0,
    fedAt: this.getLocalDateTimeString(),
    notes: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      setTimeout(() => {
        this.gramsInput?.nativeElement.focus();
      }, 0);
    }

    if (this.selectedPetId) {
      this.feeding.petId = this.selectedPetId;
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.feeding.petId) {
      this.errorMessage = 'Please select a pet';
      return;
    }

    if (!this.feeding.grams) {
      this.errorMessage = 'Please enter grams';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.feedingApiService.create(this.feeding.petId, this.feeding).subscribe({
      next: () => {
        this.isLoading = false;
        this.resetForm();
        this.feedingAdded.emit();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add feeding';
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    this.feeding = {
      petId: this.selectedPetId || (this.pets.length > 0 ? this.pets[0].id || 0 : 0),
      fedAt: this.getLocalDateTimeString(),
      notes: '',
    };
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
}
