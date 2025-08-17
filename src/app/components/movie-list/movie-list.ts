import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadMovies(): void {
    this.subscription.add(
      this.movieService.getMovies().subscribe(movies => {
        this.movies = movies;
      })
    );
  }

  onAddMovie(): void {
    this.router.navigate(['/movies/add']);
  }

  onDeleteMovie(movieId: number): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(movieId);
    }
  }

  getMoviesByCategory(category: string): Movie[] {
    return this.movies.filter(movie => movie.category === category);
  }

  getAllCategories(): string[] {
    const categories = this.movies.map(movie => movie.category);
    return [...new Set(categories)].sort();
  }
}
