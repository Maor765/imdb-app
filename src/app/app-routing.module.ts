import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImdbMovieComponent } from './componenets/imdb-movie/imdb-movie.component';
import { ImdbTvComponent } from './componenets/imdb-tv/imdb-tv.component';


const routes: Routes = [
  { path: 'movies', component: ImdbMovieComponent },
  { path: 'tvs', component: ImdbTvComponent },
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
