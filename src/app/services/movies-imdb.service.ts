import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { FileSystemFileEntry } from 'ngx-file-drop';
import {
  ITitleResultIMDB,
  ISearchIMDB,
} from '../interfaces/search-movie-imdb.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNumeric } from '../helpers/helpers.utils';
import { ImdbApiService } from './imdb-api.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesIMDBService {
  readonly base_url = 'https://imdb-api.com/en/API/';

  readonly search_url = 'SearchMovie/';
  readonly movie_url = 'Title/';

  readonly localStorage_key = 'movie-data2';

  movies: string[] = [];
  moviesMap: Map<string, ITitleResultIMDB>;
  moviesData:ITitleResultIMDB[];

  allGenres:{key:string,value:string}[] = [];

  loading = false;
  updateMoviesCount = 0;

  constructor(private http: HttpClient,
     private spinner: NgxSpinnerService,
     private imdbApiService:ImdbApiService) {
    this.moviesMap = new Map<string, ITitleResultIMDB>();
    if (localStorage.getItem(this.localStorage_key)) {
      this.moviesData = [];
      const movieAppArray = JSON.parse(
        localStorage.getItem(this.localStorage_key)
      );
      movieAppArray.forEach((element) => {
        this.moviesMap.set(element[0], element[1]);
        this.moviesData.push(element[1]);
      });
      this.getAllGenres();
    }
  }

  initLogicData() {
    this.loading = false;
    this.updateMoviesCount = 0;
  }

  public searchMovie(movie: string): Promise<any> {
    return this.http
      .get(`${this.base_url}${this.search_url}${this.imdbApiService.getApiKey()}/=${movie}`)
      .pipe(
        tap((res: ISearchIMDB) => {
          let res_movie;

          if (res.results.length === 1) {
            res_movie = res.results[0];
          } else if (res.results.length > 1) {
            res_movie = res.results[0];
            console.log('issue with movie more then 1: ', movie, res.results);
          } else {
            this.updateMoviesCount++;
            alert('movie not found :' + movie);
            console.log('issue with movie, no results: ', movie, res.results);
            this.checkEndData();
            return;
          }

          if(!this.moviesMap.has(res_movie.id)){
            this.getMovieDetails(res_movie.id).then().catch();
          } else{
            this.updateMoviesCount++;
          }
        })
      )
      .toPromise();
  }

  public getMovieDetails(id: string): Promise<any> {
    return this.http
      .get(`${this.base_url}${this.movie_url}${this.imdbApiService.getApiKey()}/${id}`)
      .pipe(
        tap((res: ITitleResultIMDB) => {
          this.moviesMap.set(res.id, this.getData(res));
          this.updateMoviesCount++;
          this.checkEndData();
        })
      )
      .toPromise();
  }

  checkEndData(){
    if (this.movies.length === this.updateMoviesCount) {
      this.spinner.hide();
      this.getAllGenres();
      this.createMoviesData();
      this.saveData();
    }
  }

  createMoviesData(){
    this.moviesData = Array.from(this.moviesMap.entries()).map( elm => (elm[1]));
  }

  getAllGenres(){
    const allGenresMap:Map<string, any> = new Map();
    Array.from(this.moviesMap.entries()).forEach( elm => {
      const movie: ITitleResultIMDB = elm[1];
      movie.genreList.forEach(genre => {
        if(!allGenresMap.has(genre.key)){
          allGenresMap.set(genre.key, genre);
        }
      });
    });
    this.allGenres = Array.from(allGenresMap.entries()).map( elm => (elm[1]));

  }

  getData(res: ITitleResultIMDB) {
    return {
      id: res.id,
      year:res.year,
      runtimeMins:res.runtimeMins,
      title: res.title,
      image: res.image,
      releaseDate: res.releaseDate,
      runtimeStr: res.runtimeStr,
      plot: res.plot,
      genreList: res.genreList,
      imDbRating: res.imDbRating,
    };
  }

  extractMovies(fileEntry: FileSystemFileEntry) {
    this.spinner.show();
    this.movies = [];
    fileEntry.file((file: File) => {
      const movie = this.getMovieFromFile(file);
      if (movie) {
        this.movies.push(movie);
        this.searchMovie(movie).then().catch();
      }
    });
  }

  // getMovieFromFile(file: File) {
  //   const fileName = file.name;
  //   if (fileName.endsWith('.mkv') || fileName.endsWith('.mp4')) {
  //     return fileName;
  //   }
  //   return null;
  // }

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

      return name;
    }
    return null;
  }

  saveData() {
    localStorage.setItem(
      this.localStorage_key,
      JSON.stringify(Array.from(this.moviesMap.entries()))
    );
  }

  clearData() {
    this.moviesMap.clear();

    localStorage.removeItem(this.localStorage_key);
  }
}
