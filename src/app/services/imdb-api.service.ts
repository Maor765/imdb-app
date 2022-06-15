import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImdbApiService {
  base_api_key = 'k_fu2ysfq6';
  private omdb_api = '400a9b5a';
  constructor() { }

  getOmdbMainUrl() {
    return `https://www.omdbapi.com/?apikey=${this.omdb_api}`;
  }
  
  getApiKey() {
    return localStorage.getItem('api_key') || this.base_api_key;
  }

  setApiKey(apiKey){
    localStorage.setItem('api_key',apiKey);
  }
}
