import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PetApiService } from '../../services/pet-api.service';
import { Pet } from '../../models/pet.model';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-edit-pet',
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './edit-pet.html',
  styleUrl: './edit-pet.scss',
})
export class EditPet implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private petApiService = inject(PetApiService);

  petForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  errorMessage = '';
  petId = '';

  constructor() {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      kind: ['dog', [Validators.required]],
      customKind: ['']
    });

    this.petForm.get('kind')?.valueChanges.subscribe(value => {
      const customKindControl = this.petForm.get('customKind');
      if (value === 'other') {
        customKindControl?.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        customKindControl?.clearValidators();
        customKindControl?.setValue('');
      }
      customKindControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id') || '';
    if (this.petId) {
      this.loadPet();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadPet(): void {
    this.isLoadingData = true;
    this.errorMessage = '';

    this.petApiService.getById(this.petId).subscribe({
      next: (pet) => {
        this.isLoadingData = false;
        this.populateForm(pet);
      },
      error: (error) => {
        this.isLoadingData = false;
        this.errorMessage = error.error?.message || 'Failed to load pet. Please try again.';
      }
    });
  }

  populateForm(pet: Pet): void {
    const isOther = !['dog', 'cat'].includes(pet.kind);
    this.petForm.patchValue({
      name: pet.name,
      breed: pet.breed,
      kind: isOther ? 'other' : pet.kind,
      customKind: isOther ? pet.customKind || pet.kind : ''
    });
  }

  get formControls() {
    return this.petForm.controls;
  }

  get isOtherKind(): boolean {
    return this.petForm.get('kind')?.value === 'other';
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const petData: Pet = {
      name: this.petForm.value.name,
      breed: this.petForm.value.breed,
      kind: this.petForm.value.kind,
      customKind: this.isOtherKind ? this.petForm.value.customKind : undefined
    };

    this.petApiService.update(this.petId, petData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update pet. Please try again.';
      }
    });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.petApiService.delete(this.petId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to delete pet. Please try again.';
      }
    });
  }
}
