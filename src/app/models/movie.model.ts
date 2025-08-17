import { MovieCategory } from '../enums/movie-category.enum';
import { MovieRating } from '../enums/movie-rating.enum';

export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  category: MovieCategory;
  rating: MovieRating;
  description?: string;
  duration?: number; // in minutes
}

