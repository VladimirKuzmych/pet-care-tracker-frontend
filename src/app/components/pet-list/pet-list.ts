import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetApiService } from '../../services/pet-api.service';
import { Pet } from '../../models/pet.model';
import { BackButton } from '../back-button/back-button';

@Component({
  selector: 'app-pet-list',
  imports: [CommonModule, BackButton],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.scss',
})
export class PetList implements OnInit {
  private petApiService = inject(PetApiService);
  private router = inject(Router);

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
      error: (error) => {
        this.errorMessage = 'Failed to load pets';
        this.isLoading = false;
        console.error('Error loading pets:', error);
      },
    });
  }

  navigateToAddPet(): void {
    this.router.navigate(['/add-pet']);
  }

  navigateToPetDetails(petId: number | undefined): void {
    if (petId) {
      this.router.navigate(['/edit-pet', petId]);
    }
  }
}
