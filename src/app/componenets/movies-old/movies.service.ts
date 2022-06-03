import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { IMovie } from '../../interfaces/movie.interface';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { isNumeric } from '../../helpers/helpers.utils';
import { ISearchMovie, ISearchMovieResult } from './search-movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  base_api_key = 'a78b646652f3f0242e35aab47ce683a9';
  readonly search_url = '/search/movie?';
  readonly base_url = 'https://api.themoviedb.org/3';
  readonly default_params = '&language=en-US&page=1&include_adult=false';

  readonly localStorage_key = 'movie-data';

  movies: IMovie[] = [];
  moviesMap: Map<string,any>;

  loading = false;
  updateMoviesCount = 0;

  constructor(private http: HttpClient) {
    this.moviesMap = new Map<string,ISearchMovie>();
    if(localStorage.getItem(this.localStorage_key)){
      const movieAppArray = JSON.parse(localStorage.getItem(this.localStorage_key));
      movieAppArray.forEach(element => {
        this.moviesMap.set(element[0],element[1]);
      });
    }
  }

  initLogicData(){
    this.loading = false;
    this.updateMoviesCount = 0;
  }

  getApiKey() {
    return localStorage.getItem('api_key') || this.base_api_key;
  }

  public searchMovie(movie: IMovie) :Promise<any> {
    return this.http
      .get(
        `${this.base_url}${this.search_url}api_key=${this.getApiKey()}${
          this.default_params
        }&query=${movie.name}`
      )
      .pipe(tap((res:ISearchMovie) => {
        let res_movie;
        
        if(res.total_results === 1){
          res_movie = res.results[0];
        } else if(res.total_results > 1){
          res_movie = res.results[0];
          console.log('issue with movie more then 1: ',movie, res.results);
        } else {
          this.updateMoviesCount++;
          alert('movie not found :'+movie.name)
          console.log('issue with movie, no results: ',movie, res.results);
          return;
        }

        this.getMovieDetails(res_movie.id).then().catch();

      })).toPromise();
  }

  public getMovieDetails(id: string) :Promise<any>{
    return this.http
      .get(
        `${this.base_url}/movie/${id}?api_key=${this.getApiKey()}&language=en-US`
      )
      .pipe(tap((res:ISearchMovieResult) => {
        this.moviesMap.set(res.id,res);
        this.updateMoviesCount++;
        if(this.movies.length === this.moviesMap.size && this.movies.length === this.updateMoviesCount ){
          this.loading = false;
          this.saveData();
        }
      })).toPromise();
  }

  extractMovies(fileEntry: FileSystemFileEntry) {
    this.loading = true;
    this.moviesMap.clear();
    this.movies = [];
    fileEntry.file((file: File) => {
      const movie = this.getMovieFromFile(file);
      if (movie) {
        this.movies.push(movie);
        this.searchMovie(movie).then().catch();;
      }
    });
  }

  getMovieFromFile(file: File) {
    const fileName = file.name;
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
      console.log(name);

      return { name, year };
    }
    return null;
  }

  saveData(){
    localStorage.setItem(this.localStorage_key, JSON.stringify(Array.from(this.moviesMap.entries())));
  }
  
  clearData(){
    localStorage.removeItem(this.localStorage_key);
  }
}
