import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  @Input() isOpen = false;
  @Input() selectedPetId: number | null = null;
  @Input() existingFeeding: Feeding | null = null;
  @Input() pets: Pet[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() feedingAdded = new EventEmitter<Feeding>();
  @Output() feedingUpdated = new EventEmitter<Feeding>();
  @Output() feedingDeleted = new EventEmitter<Feeding>();

  @ViewChild('gramsInput') gramsInput?: ElementRef<HTMLInputElement>;

  isLoading = false;
  errorMessage = '';

  feedingDate = '';
  feedingTime = '';

  feeding: Feeding = {
    petId: 0,
    fedAt: '',
    notes: '',
  };

  get isEditMode(): boolean {
    return !!this.existingFeeding;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      if (this.existingFeeding) {
        this.populateFormFromExisting();
      } else {
        this.initializeDateAndTime();
      }
      setTimeout(() => {
        this.gramsInput?.nativeElement.focus();
        this.gramsInput?.nativeElement.click();
      }, 0);
    }

    if (changes['existingFeeding'] && changes['existingFeeding'].currentValue) {
      this.populateFormFromExisting();
    }

    if (this.selectedPetId && !this.existingFeeding) {
      this.feeding.petId = this.selectedPetId;
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onDelete(): void {
    if (!this.existingFeeding) return;
    
    if (confirm('Are you sure you want to delete this feeding?')) {
      this.feedingDeleted.emit(this.existingFeeding);
      this.resetForm();
    }
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

    if (!this.feedingDate || !this.feedingTime) {
      this.errorMessage = 'Please enter both date and time';
      return;
    }

    this.feeding.fedAt = `${this.feedingDate}T${this.feedingTime}`;

    if (this.isEditMode) {
      this.feedingUpdated.emit(this.feeding);
    } else {
      this.feedingAdded.emit(this.feeding);
    }

    this.resetForm();
  }

  resetForm(): void {
    this.feeding = {
      petId: this.selectedPetId || (this.pets.length > 0 ? this.pets[0].id || 0 : 0),
      fedAt: '',
      notes: '',
    };
    this.initializeDateAndTime();
    this.errorMessage = '';
  }

  initializeDateAndTime(): void {
    const now = new Date();
    this.feedingDate = this.getDateString(now);
    this.feedingTime = this.getTimeString(now);
  }

  populateFormFromExisting(): void {
    if (!this.existingFeeding) return;

    this.feeding = { ...this.existingFeeding };

    if (this.existingFeeding.fedAt) {
      const fedAtDate = new Date(this.existingFeeding.fedAt);
      this.feedingDate = this.getDateString(fedAtDate);
      this.feedingTime = this.getTimeString(fedAtDate);
    }
  }

  getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTimeString(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
