import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { FileSystemFileEntry } from 'ngx-file-drop';

import { ImdbApiService } from './imdb-api.service';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TvsIMDBService {
  readonly base_url = 'https://imdb-api.com/en/API/';

  readonly localStorage_key = 'tv-data2';

  tvsNameMap: Map<string, any> = new Map();

  loading = false;
  updateMoviesCount = 0;

  allGenres: { value: string }[] = [];

  tvsData: Array<OmdbMovie>;
  fetchingDataStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private imdbApiService: ImdbApiService
  ) {
    if (localStorage.getItem(this.localStorage_key)) {
      this.tvsData = [];
      this.tvsData = JSON.parse(localStorage.getItem(this.localStorage_key));
      this.getAllGenres();
    }
  }

  initLogicData() {
    this.loading = false;
    this.updateMoviesCount = 0;
  }

  getAllGenres() {
    const allGenresMap: Map<string, any> = new Map();
    this.tvsData.forEach((tv) => {
      tv.genreList?.forEach((genre) => {
        if (!allGenresMap.has(genre)) {
          allGenresMap.set(genre, true);
        }
      });
    });
    this.allGenres = Array.from(allGenresMap.keys()).map((elm) => ({
      value: elm,
    }));
  }

  extractTvNames(fileEntry: FileSystemFileEntry) {
    const tvName = this.getTvNameFromFile(fileEntry.name);
    if (tvName && !this.tvsNameMap.has(tvName)) {
      this.tvsNameMap.set(tvName, true);
    }
  }

  getTvData() {
    let movieApiCallCount = 0;
    this.tvsData = [];
    this.tvsNameMap.forEach((value, key) => {
      this.searchTv(key).then((res: OmdbMovie) => {
        movieApiCallCount++;
        if (res.Response === 'True') {
          this.tvsData.push({
            ...res,
            genreList: res.Genre.split(',').map((elm) => elm.replace(' ', '')),
            runtimeMins: Number(res.Runtime.replace('min', '')),
            releaseDate: moment(res.Released).format('YYYY-MM-DD'),
          });
        } else {
          console.log('issue with tv, no results: ', key, res);
        }
        if (movieApiCallCount === this.tvsNameMap.size) {
          this.getAllGenres();
          this.saveData();
          this.fetchingDataStatus.next(true);
        }
      });
    });
  }

  getOmdbUrl(tvName: string) {
    const apiKey = '400a9b5a';
    return `https://www.omdbapi.com/?apikey=${apiKey}&type=series&t=${tvName}`;
  }

  searchTv(tvName: string) {
    return this.http.get(this.getOmdbUrl(tvName)).toPromise();
  }

  getTvNameFromFile(fileName: string) {
    if (fileName.endsWith('.mkv')) {
      const spiltStr = fileName.split('.');

      let seasonName = '';
      let seasonInd;
      for (let i = 0; i < spiltStr.length - 1; i++) {
        //searching for sXXeYY OR year XXXX
        if (
          (spiltStr[i].length === 6 &&
            spiltStr[i][0].toLowerCase() === 's' &&
            this.is_numeric(spiltStr[i][1])) ||
          (spiltStr[i].length === 4 && Number(spiltStr[i]))
        ) {
          seasonInd = i;
          break;
        }
      }

      if (spiltStr[seasonInd - 1].toLocaleLowerCase() === 'us') {
        seasonInd--;
      }
      for (let i = 0; i < seasonInd; i++) {
        seasonName += spiltStr[i].toLocaleLowerCase();
        if (i + 1 !== seasonInd) seasonName += ' ';
      }

      return seasonName;
    }
    return null;
  }

  is_numeric(str) {
    return /^\d+$/.test(str);
  }

  saveData() {
    localStorage.setItem(this.localStorage_key, JSON.stringify(this.tvsData));
  }

  clearData() {
    this.tvsData = [];
    localStorage.removeItem(this.localStorage_key);
  }
}
