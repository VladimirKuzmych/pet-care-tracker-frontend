import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserApiService } from '../../services/user-api.service';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private authService = inject(AuthService);
  private userApiService = inject(UserApiService);
  private fb = inject(FormBuilder);

  isLoadingProfile = false;
  isLoadingPassword = false;
  profileMessage = '';
  passwordMessage = '';
  profileError = '';
  passwordError = '';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/\d/),
        Validators.pattern(/\D/)
      ]],
      confirmPassword: ['', Validators.required],
    });
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }

  updateUser(form: FormGroup, isPasswordUpdate: boolean = false): void {
    if (isPasswordUpdate) {
      this.passwordError = '';
      this.passwordMessage = '';
    } else {
      this.profileError = '';
      this.profileMessage = '';
    }

    if (!form.valid) {
      if (isPasswordUpdate) {
        this.passwordError = 'Please fill in all required fields correctly';
      } else {
        this.profileError = 'Please fill in all required fields correctly';
      }
      return;
    }

    if (isPasswordUpdate) {
      const { newPassword, confirmPassword } = form.value;
      if (newPassword !== confirmPassword) {
        this.passwordError = 'New passwords do not match';
        return;
      }
    }

    const user = this.authService.getCurrentUser();
    if (!user?.userId) {
      if (isPasswordUpdate) {
        this.passwordError = 'User not found';
      } else {
        this.profileError = 'User not found';
      }
      return;
    }

    if (isPasswordUpdate) {
      this.isLoadingPassword = true;
      const { currentPassword, newPassword } = form.value;
      this.userApiService.changePassword(user.userId, { currentPassword, newPassword }).subscribe({
        next: () => {
          this.passwordMessage = 'Password updated successfully';
          form.reset();
          this.isLoadingPassword = false;
        },
        error: (error) => {
          this.passwordError = error.error?.message || 'Failed to update password';
          this.isLoadingPassword = false;
        },
      });
    } else {
      this.isLoadingProfile = true;
      this.userApiService.patchUser(user.userId, form.value).subscribe({
        next: () => {
          this.profileMessage = 'Profile updated successfully';
          this.isLoadingProfile = false;
        },
        error: (error) => {
          this.profileError = error.error?.message || 'Failed to update profile';
          this.isLoadingProfile = false;
        },
      });
    }
  }
}
