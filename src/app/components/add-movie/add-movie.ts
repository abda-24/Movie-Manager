import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MovieCategory } from '../../enums/movie-category.enum';
import { MovieRating } from '../../enums/movie-rating.enum';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-movie.html',
  styleUrls: ['./add-movie.css']
})
export class AddMovieComponent implements OnInit {
  movieForm!: FormGroup;
  movieCategories = Object.values(MovieCategory);
  movieRatings = Object.values(MovieRating);
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.movieForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      director: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      releaseYear: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear() + 5)
      ]],
      category: ['', Validators.required],
      rating: ['', Validators.required],
      description: ['', [Validators.maxLength(500)]],
      duration: ['', [Validators.min(1), Validators.max(600)]]
    });
  }

  onSubmit(): void {
    if (this.movieForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const movieData = {
        ...this.movieForm.value,
        releaseYear: parseInt(this.movieForm.value.releaseYear),
        duration: this.movieForm.value.duration ? parseInt(this.movieForm.value.duration) : undefined
      };

      try {
        this.movieService.addMovie(movieData);
        this.router.navigate(['/movies/list']);
      } catch (error) {
        console.error('Error adding movie:', error);
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.movieForm.controls).forEach(key => {
      const control = this.movieForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.movieForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.movieForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required.`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters.`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters.`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}.`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['max'].max}.`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      title: 'Title',
      director: 'Director',
      releaseYear: 'Release Year',
      category: 'Category',
      rating: 'Rating',
      description: 'Description',
      duration: 'Duration'
    };
    return displayNames[fieldName] || fieldName;
  }

  onCancel(): void {
    this.router.navigate(['/movies/list']);
  }
}
