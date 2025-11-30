import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/\d/),
        Validators.pattern(/\D/)
      ]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator = ({ value }: AbstractControl): ValidationErrors | null => {
    return this.registrationForm?.value.password === value ? null : { passwordMismatch: true };
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    console.log('Registration successful', this.registrationForm.value);
    // Add your registration logic here
  }
}
