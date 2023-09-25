import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isNumeric } from '../helpers/helpers.utils';
import { ImdbApiService } from './imdb-api.service';
import { OmdbBaseService } from './omdb-base.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesIMDBService extends OmdbBaseService {
  constructor(
    protected http: HttpClient,
    protected imdbApiService: ImdbApiService
  ) {
    super(http, imdbApiService, 'movie', 'movie-data2');
  }

  getNameFromFile(fileName: string) {
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
        name = name.length === 0 ? splitByDots[i] : `${name} ${splitByDots[i]}`;
      }

      return name;
    }
    return null;
  }
}
