import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isResettingPassword = false;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authApiService: AuthApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onResetPassword() {
    const email = this.loginForm.get('email')?.value;
    
    if (!email || this.loginForm.get('email')?.invalid) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    const confirmed = confirm(`Are you sure you want to reset the password for ${email}? Check your email for further instructions.`);
    
    if (!confirmed) {
      return;
    }

    this.isResettingPassword = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authApiService.resetPassword(email).subscribe({
      next: () => {
        this.isResettingPassword = false;
        this.successMessage = 'Password reset link has been sent to your email.';
      },
      error: (error) => {
        this.isResettingPassword = false;
        this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
      }
    });
  }
}
