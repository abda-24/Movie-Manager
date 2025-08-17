import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieCategory } from '../enums/movie-category.enum';
import { MovieRating } from '../enums/movie-rating.enum';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'The Matrix',
      director: 'The Wachowskis',
      releaseYear: 1999,
      category: MovieCategory.SCIENCE_FICTION,
      rating: MovieRating.R,
      description: 'A computer programmer discovers reality is a simulation.',
      duration: 136
    },
    {
      id: 2,
      title: 'Inception',
      director: 'Christopher Nolan',
      releaseYear: 2010,
      category: MovieCategory.THRILLER,
      rating: MovieRating.PG_13,
      description: 'A thief enters people\'s dreams to steal secrets.',
      duration: 148
    }
  ];

  private moviesSubject = new BehaviorSubject<Movie[]>(this.movies);
  private nextId = 3;

  constructor() { }

  getMovies(): Observable<Movie[]> {
    return this.moviesSubject.asObservable();
  }

  addMovie(movie: Omit<Movie, 'id'>): Movie {
    const newMovie: Movie = {
      ...movie,
      id: this.nextId++
    };
    
    this.movies.push(newMovie);
    this.moviesSubject.next([...this.movies]);
    
    return newMovie;
  }

  getMovieById(id: number): Movie | undefined {
    return this.movies.find(movie => movie.id === id);
  }

  updateMovie(id: number, updatedMovie: Partial<Movie>): Movie | null {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies[index] = { ...this.movies[index], ...updatedMovie };
      this.moviesSubject.next([...this.movies]);
      return this.movies[index];
    }
    return null;
  }

  deleteMovie(id: number): boolean {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      this.moviesSubject.next([...this.movies]);
      return true;
    }
    return false;
  }
}

