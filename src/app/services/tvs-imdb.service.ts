import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { FileSystemFileEntry } from 'ngx-file-drop';
import {
  ITitleResultIMDB,
  ISearchIMDB,
} from '../interfaces/search-movie-imdb.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImdbApiService } from './imdb-api.service';

@Injectable({
  providedIn: 'root',
})
export class TvsIMDBService {
  readonly base_url = 'https://imdb-api.com/en/API/';

  readonly search_url = 'SearchSeries/';
  readonly movie_url = 'Title/';

  readonly localStorage_key = 'tv-data2';

  tvsNameMap: Map<string, any>;
  tvsMapData: Map<string, any>;
  tvData:ITitleResultIMDB[];

  loading = false;
  updateMoviesCount = 0;

  allGenres:{key:string,value:string}[] = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService,private imdbApiService:ImdbApiService) {
    this.tvsMapData = new Map<string, ITitleResultIMDB>();
    if (localStorage.getItem(this.localStorage_key)) {
      this.tvData = [];

      const movieAppArray = JSON.parse(
        localStorage.getItem(this.localStorage_key)
      );
      movieAppArray.forEach((element) => {
        this.tvsMapData.set(element[0], element[1]);
        this.tvData.push(element[1]);
      });

      this.getAllGenres();
    }
  }

  initLogicData() {
    this.loading = false;
    this.updateMoviesCount = 0;
  }

  public searchTv(tvName: string): Promise<any> {
    return this.http
      .get(`${this.base_url}${this.search_url}${this.imdbApiService.getApiKey()}/${tvName}`)
      .pipe(
        tap((res: ISearchIMDB) => {
          let res_tv;

          if (res.results.length === 1) {
            res_tv = res.results[0];
          } else if (res.results.length > 1) {
            res_tv = res.results[0];
            console.log('issue with tv more then 1: ', tvName, res.results);
          } else {
            this.updateMoviesCount++;
            alert('tv not found :' + tvName);
            console.log('issue with tv, no results: ', tvName, res.results);
            this.checkEndData();
            return;
          }

          if(!this.tvsMapData.has(res_tv.id)){
            this.getTvDetails(res_tv.id).then().catch();
          } else{
            this.updateMoviesCount++;
          }
        }),
        catchError((err, caught) => caught),
      )
      .toPromise();
  }

  public getTvDetails(id: string): Promise<any> {
    return this.http
      .get(`${this.base_url}${this.movie_url}${this.imdbApiService.getApiKey()}/${id}`)
      .pipe(
        tap((res: ITitleResultIMDB) => {
          this.tvsMapData.set(res.id, this.getData(res));
          this.updateMoviesCount++;
          this.checkEndData();
        })
      )
      .toPromise();
  }

  checkEndData(){
    if (this.tvsNameMap.size === this.updateMoviesCount) {
      this.spinner.hide();
      this.getAllGenres();
      this.createTvsData();
      this.saveData();
    }
  }

  createTvsData(){
    this.tvData = Array.from(this.tvsMapData.entries()).map( elm => (elm[1]));
  }

  getAllGenres(){
    const allGenresMap:Map<string, any> = new Map();
    Array.from(this.tvsMapData.entries()).forEach( elm => {
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

  extractTvs(fileEntry: FileSystemFileEntry) {
    this.spinner.show();
    this.tvsNameMap = new Map();
    fileEntry.file((file: File) => {
      const tvName = this.getTvNameFromFile(file);
      if(tvName && !this.tvsNameMap.has(tvName)){
        this.tvsNameMap.set(tvName, true);
        this.searchTv(tvName).then().catch();
      }
    });
  }

  getTvNameFromFile(file: File) {
    const fileName = file.name;
    if(fileName.endsWith('.mkv')){
      const spiltStr = fileName.split('.');

      let seasonName='';
      let seasonInd;
      let season_number;

      for(let i=0;i<spiltStr.length - 1;i++){
        // console.log(2,spiltStr[i]) 
        if(spiltStr[i].length === 6 && spiltStr[i][0].toLowerCase() === 's' && this.is_numeric(spiltStr[i][1]) ){
          seasonInd = i;
          season_number = Number(spiltStr[i][1] + spiltStr[i][2])
          break;
        }
      }

      for(let i=0;i<seasonInd;i++){
        seasonName+=(spiltStr[i] + ' ')
      }

      return seasonName;
      // return {seasonName,season_number};
  }
  return null;
  }

  is_numeric(str){
      return /^\d+$/.test(str);
  }

  saveData() {
    localStorage.setItem(
      this.localStorage_key,
      JSON.stringify(Array.from(this.tvsMapData.entries()))
    );
  }

  clearData() {
    this.tvsMapData.clear();

    localStorage.removeItem(this.localStorage_key);
  }
}
