import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImdbApiService } from './imdb-api.service';
import { OmdbBaseService } from './omdb-base.service';

@Injectable({
  providedIn: 'root',
})
export class TvsIMDBService extends OmdbBaseService {

  constructor(
    protected http: HttpClient,
    protected imdbApiService: ImdbApiService
  ) {
    super(http, imdbApiService, 'series', 'tv-data2');
  }

  getNameFromFile(fileName: string) {
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

      if (!seasonInd) return '';

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
}
