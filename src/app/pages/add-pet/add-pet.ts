import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetApiService } from '../../services/pet-api.service';
import { Pet } from '../../models/pet.model';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-add-pet',
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './add-pet.html',
  styleUrl: './add-pet.scss',
})
export class AddPet {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private petApiService = inject(PetApiService);

  petForm: FormGroup;
  isLoading = false;
  errorMessage = '';

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
      kind: this.petForm.value.customKind || this.petForm.value.kind,
    };

    this.petApiService.create(petData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to add pet. Please try again.';
      }
    });
  }
}
