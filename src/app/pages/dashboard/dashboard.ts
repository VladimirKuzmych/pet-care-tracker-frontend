import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedingApiService } from '../../services/feeding-api.service';
import { AuthService } from '../../services/auth.service';
import { FeedingSummary } from '../../models/feeding.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private feedingApiService = inject(FeedingApiService);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  feedingSummaries: FeedingSummary[] = [];

  ngOnInit(): void {
    this.loadFeedingSummary();
  }

  loadFeedingSummary(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      return;
    }

    this.isLoading = true;
    this.feedingApiService.getTodaySummary(user.userId).subscribe({
      next: (summaries) => {
        this.feedingSummaries = summaries;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load feeding summary';
        this.isLoading = false;
      },
    });
  }
}
