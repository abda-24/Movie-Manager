import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list';
import { AddMovieComponent } from './components/add-movie/add-movie';

export const routes: Routes = [
  { path: '', redirectTo: '/movies/list', pathMatch: 'full' },
  { path: 'movies/list', component: MovieListComponent },
  { path: 'movies/add', component: AddMovieComponent },
  { path: '**', redirectTo: '/movies/list' }
];
