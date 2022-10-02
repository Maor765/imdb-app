import { Injectable } from '@angular/core';
import {sortBy} from 'lodash';
import { OmdbMovie } from '../interfaces/omdb.movie.interface';

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
  sortFieldsOptions2:{label: string, value:any}[];

  sortFields= [
    {label:'Title',field:'title',type:TitleFieldType.STRING},
    {label:'Release Date',field:'releaseDate',type:TitleFieldType.DATE},
    {label:'Runtime',field:'runtimeMins',type:TitleFieldType.NUMBER},
    {label:'IMDB Rating',field:'imDbRating',type:TitleFieldType.NUMBER}
  ];

  sortFields2= [
    {label:'Title',field:'Title',type:TitleFieldType.STRING},
    {label:'Release Date',field:'releaseDate',type:TitleFieldType.DATE},
    {label:'Runtime',field:'runtimeMins',type:TitleFieldType.NUMBER},
    {label:'IMDB Rating',field:'imdbRating',type:TitleFieldType.STRING}
  ];

  constructor() { 
    this.sortFieldsOptions = this.sortFields.map(elm => ({label:elm.label,value:elm}))
    this.sortFieldsOptions2 = this.sortFields2.map(elm => ({label:elm.label,value:elm}))


  }

  sortBy(selectedSort: ISortField, moviesData: OmdbMovie[]){
    return sortBy(moviesData,[selectedSort.field]);
  }

  getAllGenres(selectedGenre: any[], moviesData: OmdbMovie[]){
    const res = [];
    moviesData.forEach( movie => {
        let found = true;
        selectedGenre.forEach(genre => {
          if(!movie.genreList.find(mg => mg === genre.value)){
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
