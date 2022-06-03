import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImdbApiService {
  base_api_key = 'k_fu2ysfq6';

  constructor() { }

  
  getApiKey() {
    return localStorage.getItem('api_key') || this.base_api_key;
  }

  setApiKey(apiKey){
    localStorage.setItem('api_key',apiKey);
  }
}
