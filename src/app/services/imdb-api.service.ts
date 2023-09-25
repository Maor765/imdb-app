import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImdbApiService {
  private omdb_api = '400a9b5a';
  constructor() { 
    this.omdb_api = this.getApiKey();
  }

  getOmdbMainUrl() {
    return `https://www.omdbapi.com/?apikey=${this.omdb_api}`;
  }
  
  getApiKey() {
    return localStorage.getItem('api_key') || this.omdb_api;
  }

  setApiKey(apiKey){
    this.omdb_api = apiKey;
    localStorage.setItem('api_key',apiKey);
  }
}
