import { Injectable } from '@angular/core';
import { ITitleResultIMDB } from '../interfaces/search-movie-imdb.interface';
import {sortBy} from 'lodash';

export interface ISortField{
  label: string;
  field:string;
  type:string;
}

export enum TitleFieldType{
  STRING = 'string',
  DATE= 'date',
  RUNTIME = 'runtime',
  NUMBER = 'number'
}

@Injectable({
  providedIn: 'root'
})
export class FilterUtilService {

  sortFieldsOptions:{label: string, value:any}[];

  sortFields= [
    {label:'Title',field:'title',type:TitleFieldType.STRING},
    {label:'Release Date',field:'releaseDate',type:TitleFieldType.DATE},
    {label:'Runtime',field:'runtimeMins',type:TitleFieldType.NUMBER},
    {label:'IMDB Rating',field:'imDbRating',type:TitleFieldType.NUMBER}
  ];

  constructor() { 
    this.sortFieldsOptions = this.sortFields.map(elm => ({label:elm.label,value:elm}))

  }

  sortBy(selectedSort: ISortField, moviesData: ITitleResultIMDB[]){
    return sortBy(moviesData,[selectedSort.field]);
  }

  getAllGenres(selectedGenre: any[], moviesData: ITitleResultIMDB[]){
    const res = [];
    moviesData.forEach( movie => {
        let found = true;
        selectedGenre.forEach(genre => {
          if(!movie.genreList.find(mg => mg.key === genre.key)){
            found = false;
          }
        })
        if(found){
          res.push(movie);
        }
    })
    return res;
  }

}
