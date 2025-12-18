import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PetApiService } from '../../services/pet-api.service';
import { PetFeedingSummaryTodayPipe } from "../../pipes/pet-feeding-summary-today";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, PetFeedingSummaryTodayPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private petApiService = inject(PetApiService);

  pets$ = this.petApiService.getAll();
}
