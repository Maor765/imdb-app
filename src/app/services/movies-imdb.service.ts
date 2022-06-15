import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { isNumeric } from '../helpers/helpers.utils';
import { ImdbApiService } from './imdb-api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesIMDBService {

  readonly localStorage_key = 'movie-data2';

  loading = false;
  updateMoviesCount = 0;

  moviesNameMap: Map<string, any> = new Map();
  moviesData2: Array<OmdbMovie>;
  fetchingDataStatus = new Subject<boolean>();
  allGenres: { value: string }[] = [];

  constructor(private http: HttpClient,
     private imdbApiService:ImdbApiService) {

    if (localStorage.getItem(this.localStorage_key)) {
      this.moviesData2 = [];
      this.moviesData2 = JSON.parse(localStorage.getItem(this.localStorage_key));
      this.getAllGenres();
    }
  }


  getAllGenres(){
    const allGenresMap: Map<string, any> = new Map();
    this.moviesData2.forEach((movie) => {
      movie.genreList?.forEach((genre) => {
        if (!allGenresMap.has(genre)) {
          allGenresMap.set(genre, true);
        }
      });
    });
    this.allGenres = Array.from(allGenresMap.keys()).map((elm) => ({
      value: elm,
    }));
  }


  extractMovies(fileEntry: FileSystemFileEntry) {
    const movie = this.getMovieFromFile(fileEntry.name);
    if (movie && !this.moviesNameMap.has(movie)) {
      this.moviesNameMap.set(movie, true);
    }
  }

  getMovieFromFile(fileName: string) {
    if (fileName.endsWith('.mkv') || fileName.endsWith('.mp4')) {
      let splitByDots = fileName.split('.');
      if (splitByDots.length <= 3) {
        splitByDots = fileName.split(' ');
      }
      let name = '';
      let year;
      for (let i = 0; i < splitByDots.length; i++) {
        if (splitByDots[i].length === 4 && isNumeric(splitByDots[i])) {
          year = Number(splitByDots[i]);
          break;
        }
        name = `${name} ${splitByDots[i]}`;
      }

      return name; 
    }
    return null;
  }

  getMoviesData() {
    let movieApiCallCount = 0;
    this.moviesData2 = [];
    this.moviesNameMap.forEach((value, key) => {
      this.searchMovie(key).then((res: OmdbMovie) => {
        movieApiCallCount++;
        if (res.Response === 'True') {
          this.moviesData2.push({
            ...res,
            genreList: res.Genre.split(',').map((elm) => elm.replace(' ', '')),
            runtimeMins: Number(res.Runtime.replace('min', '')),
            releaseDate: moment(res.Released).format('YYYY-MM-DD'),
          });
        } else {
          console.log('issue with tv, no results: ', key, res);
        }
        if (movieApiCallCount === this.moviesNameMap.size) {
          this.getAllGenres();
          this.saveData();
          this.fetchingDataStatus.next(true);
        }
      });
    });
  }

  getOmdbUrl(movieName: string) {
    let url = this.imdbApiService.getOmdbMainUrl()
    return `${url}&type=movie&t=${movieName}`;
  }

  searchMovie(tvName: string) {
    return this.http.get(this.getOmdbUrl(tvName)).toPromise();
  }

  saveData() {
    localStorage.setItem(this.localStorage_key, JSON.stringify(this.moviesData2));
  }

  clearData() {
    this.moviesData2 = [];
    localStorage.removeItem(this.localStorage_key);
  }
}
