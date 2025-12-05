import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PetApiService } from '../../services/pet-api.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private petApiService = inject(PetApiService);
  private router = inject(Router);

  pets$!: Observable<Pet[]>;
  pets: Pet[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.petApiService.getAll().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load pets';
        this.isLoading = false;
      }
    });
  }

  navigateToAddPet(): void {
    this.router.navigate(['/add-pet']);
  }

  navigateToEditPet(petId: string): void {
    this.router.navigate(['/edit-pet', petId]);
  }

  getKindDisplay(pet: Pet): string {
    return pet.kind === 'other' && pet.customKind ? pet.customKind : pet.kind;
  }

  navigateToFeedings(): void {
    this.router.navigate(['/feedings']);
  }
}
