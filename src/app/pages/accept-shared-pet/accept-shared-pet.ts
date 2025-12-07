import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharePetApiService } from '../../services/share-pet-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accept-shared-pet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accept-shared-pet.html',
  styleUrls: ['./accept-shared-pet.scss']
})
export class AcceptSharedPet implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sharePetApiService = inject(SharePetApiService);

  loading = true;
  success = false;
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    
    if (!token) {
      this.error = true;
      this.errorMessage = 'Invalid or missing token';
      this.loading = false;
      return;
    }

    this.acceptPet(token);
  }

  private acceptPet(token: string): void {
    this.sharePetApiService.acceptSharedPet(token).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = err.error?.message || 'Failed to accept shared pet';
      }
    });
  }

  goToPets(): void {
    this.router.navigate(['/pets']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
