import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { FileSystemFileEntry } from 'ngx-file-drop';
import {
  ITitleResultIMDB,
  ISearchIMDB,
} from '../interfaces/search-movie-imdb.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImdbApiService } from './imdb-api.service';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TvsIMDBService {
  readonly base_url = 'https://imdb-api.com/en/API/';

  readonly search_url = 'SearchSeries/';
  readonly movie_url = 'Title/';

  readonly localStorage_key = 'tv-data2';

  tvsNameMap: Map<string, any> = new Map();
  // tvsMapData: Map<string, any>;

  // tvData: ITitleResultIMDB[];

  loading = false;
  updateMoviesCount = 0;

  allGenres: string[] = [];

  tvsData: Array<OmdbMovie>;
  fetchingDataStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    public spinner: NgxSpinnerService,
    private imdbApiService: ImdbApiService
  ) {
    if (localStorage.getItem(this.localStorage_key)) {
      this.tvsData = [];
      this.tvsData = JSON.parse(
        localStorage.getItem(this.localStorage_key)
      );
      this.getAllGenres();
    }
  }

  initLogicData() {
    this.loading = false;
    this.updateMoviesCount = 0;
  }

  // public searchTv(tvName: string): Promise<any> {
  //   return this.http
  //     .get(
  //       `${this.base_url}${
  //         this.search_url
  //       }${this.imdbApiService.getApiKey()}/${tvName}`
  //     )
  //     .pipe(
  //       tap((res: ISearchIMDB) => {
  //         let res_tv;
  //         if (res.results.length === 1) {
  //           res_tv = res.results[0];
  //         } else if (res.results.length > 1) {
  //           res_tv = res.results[0];
  //           console.log('issue with tv more then 1: ', tvName, res.results);
  //         } else {
  //           this.updateMoviesCount++;
  //           alert('tv not found :' + tvName);
  //           console.log('issue with tv, no results: ', tvName, res.results);
  //           this.checkEndData();
  //           return;
  //         }

  //         if (!this.tvsMapData.has(res_tv.id)) {
  //           this.getTvDetails(res_tv.id).then().catch();
  //         } else {
  //           this.updateMoviesCount++;
  //         }
  //       })
  //     )
  //     .toPromise();
  // }

  // public getTvDetails(id: string): Promise<any> {
  //   return this.http
  //     .get(
  //       `${this.base_url}${
  //         this.movie_url
  //       }${this.imdbApiService.getApiKey()}/${id}`
  //     )
  //     .pipe(
  //       tap((res: ITitleResultIMDB) => {
  //         this.tvsMapData.set(res.id, this.getData(res));
  //         this.updateMoviesCount++;
  //         this.checkEndData();
  //       })
  //     )
  //     .toPromise();
  // }

  // checkEndData() {
  //   if (this.tvsNameMap.size === this.updateMoviesCount) {
  //     this.spinner.hide();
  //     this.getAllGenres();
  //     this.createTvsData();
  //     this.saveData();
  //   }
  // }

  createTvsData() {
    // this.tvData = Array.from(this.tvsMapData.entries()).map((elm) => elm[1]);
  }

  getAllGenres() {
    const allGenresMap: Map<string, boolean> = new Map();
    // Array.from(this.tvsMapData.entries()).forEach((elm) => {
    //   const tv: ITitleResultIMDB = elm[1];
    //   tv.genreList?.forEach((genre) => {
    //     if (!allGenresMap.has(genre.key)) {
    //       allGenresMap.set(genre.key, genre);
    //     }
    //   });
    // });
    this.tvsData.forEach(tv => {
      tv.genreList?.forEach((genre) => {
        if (!allGenresMap.has(genre)) {
          allGenresMap.set(genre, true);
        }
      });
    })
    this.allGenres = Array.from(allGenresMap.keys());
  }

  // getData(res: ITitleResultIMDB) {
  //   return {
  //     id: res.id,
  //     year: res.year,
  //     runtimeMins: res.runtimeMins,
  //     title: res.title,
  //     image: res.image,
  //     releaseDate: res.releaseDate,
  //     runtimeStr: res.runtimeStr,
  //     plot: res.plot,
  //     genreList: res.genreList,
  //     imDbRating: res.imDbRating,
  //   };
  // }

  extractTvNames(fileEntry: FileSystemFileEntry) {    
    const tvName = this.getTvNameFromFile(fileEntry.name);
      if (tvName && !this.tvsNameMap.has(tvName)) {
        this.tvsNameMap.set(tvName, true);
      }
  }

  getTvData() {
    let movieApiCallCount = 0;
    this.tvsData = [];
    this.tvsNameMap.forEach((value,key) => {
      this.searchTv(key).then((res: OmdbMovie) => {
        movieApiCallCount++;
        if(res.Response) {
          console.log('moment',moment(res.Released, 'YYYY-MM-DD') )
          console.log('moment 2', moment(res.Released).format('YYYY-MM-DD') )

          const mom = moment(res.Released).format('YYYY-MM-DD')
          this.tvsData.push(
            {...res,
              genreList: res.Genre.split(',').map(elm=> elm.replace(' ','')), 
              runtimeMins: Number(res.Runtime.replace("min","")),
              releaseDate:  moment(res.Released).format('YYYY-MM-DD')
            });
        } else {
          console.log('issue with tv, no results: ', key, res);
        }
        if(movieApiCallCount === this.tvsNameMap.size) {
          this.getAllGenres();
          this.saveData();
          this.fetchingDataStatus.next(true);
        }
      })
     });

  }

  getOmdbUrl (tvName: string) {
    const apiKey = '400a9b5a';
    return `https://www.omdbapi.com/?apikey=${apiKey}&type=series&t=${tvName}`
  }

  searchTv(tvName: string) {
    return this.http
    .get(this.getOmdbUrl(tvName))
    .toPromise();
  }

  getTvNameFromFile(fileName: string) {
    if (fileName.endsWith('.mkv')) {
      const spiltStr = fileName.split('.');

      let seasonName = '';
      let seasonInd;
      // console.log(spiltStr);
      for (let i = 0; i < spiltStr.length - 1; i++) {
        //searching for sXXeYY OR year XXXX
        if (
          (spiltStr[i].length === 6 &&
          spiltStr[i][0].toLowerCase() === 's' &&
          this.is_numeric(spiltStr[i][1])) 
          || 
          (spiltStr[i].length === 4 && Number(spiltStr[i]))
        ) {
          seasonInd = i;
          break;
        }
      }

      if(spiltStr[seasonInd - 1].toLocaleLowerCase() === 'us'){
        seasonInd--;
      }
      for (let i = 0; i < seasonInd; i++) {
        seasonName += spiltStr[i].toLocaleLowerCase();
        if(i + 1 !== seasonInd)  seasonName += ' ';
      }

      return seasonName;
    }
    return null;
  }

  is_numeric(str) {
    return /^\d+$/.test(str);
  }

  saveData() {
    localStorage.setItem(
      this.localStorage_key,
      JSON.stringify(this.tvsData)
    );
  }

  clearData() {
    // this.tvsMapData.clear();
    this.tvsData = [];
    localStorage.removeItem(this.localStorage_key);
  }
}
