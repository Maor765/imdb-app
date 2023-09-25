import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';
import { ImdbApiService } from './imdb-api.service';
import { FileSystemFileEntry } from 'ngx-file-drop';

export abstract class OmdbBaseService {
  data: Array<OmdbMovie>;
  allGenres: { value: string }[] = [];
  nameMap: Map<string, any> = new Map();
  fetchingDataStatus = new Subject<boolean>();

  constructor(
    protected http: HttpClient,
    protected imdbApiService: ImdbApiService,
    private searchType: string,
    private localStorageKey: string
  ) {
    if (localStorage.getItem(this.localStorageKey)) {
      this.data = [];
      this.data = JSON.parse(localStorage.getItem(this.localStorageKey));
      this.getAllGenres();
    }
  }

  abstract getNameFromFile(fileName: string);

  getAllGenres() {
    const allGenresMap: Map<string, any> = new Map();
    this.data.forEach((d) => {
      d.genreList?.forEach((genre) => {
        if (!allGenresMap.has(genre)) {
          allGenresMap.set(genre, true);
        }
      });
    });
    this.allGenres = Array.from(allGenresMap.keys()).map((elm) => ({
      value: elm,
    }));
  }

  extractNames(fileEntry: FileSystemFileEntry) {
    const movie = this.getNameFromFile(fileEntry.name);
    if (movie && !this.nameMap.has(movie)) {
      this.nameMap.set(movie, true);
    }
  }

  getData() {
    let apiCallCount = 0;
    this.data = [];
    this.nameMap.forEach((value, key) => {
      this.search(key).then((res: OmdbMovie) => {
        apiCallCount++;
        if (res.Response === 'True') {
          this.data.push({
            ...res,
            genreList: res.Genre.split(',').map((elm) => elm.replace(' ', '')),
            runtimeMins: Number(res.Runtime.replace('min', '')),
            releaseDate: moment(res.Released).format('YYYY-MM-DD'),
          });
        } else {
          console.log('issue with tv, no results: ', key, res);
        }
        if (apiCallCount === this.nameMap.size) {
          this.getAllGenres();
          this.saveData();
          this.fetchingDataStatus.next(true);
        }
      });
    });
  }

  getOmdbUrl(name: string) {
    let url = this.imdbApiService.getOmdbMainUrl();
    return `${url}&type=${this.searchType}&t=${name}`;
  }

  search(tvName: string) {
    return this.http.get(this.getOmdbUrl(tvName)).toPromise();
  }

  saveData() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
  }

  clearData() {
    this.data = [];
    localStorage.removeItem(this.localStorageKey);
  }
}
