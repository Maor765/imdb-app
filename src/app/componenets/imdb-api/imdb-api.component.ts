import { Component, OnInit } from '@angular/core';
import { ImdbApiService } from 'src/app/services/imdb-api.service';

@Component({
  selector: 'app-imdb-api',
  templateUrl: './imdb-api.component.html',
  styleUrls: ['./imdb-api.component.scss']
})
export class ImdbApiComponent implements OnInit {

  apiKey = "";
  display: boolean = false;

  constructor(private imdbApiService:ImdbApiService) { }

  ngOnInit(): void {
  }

  updateApiKey(){
    this.imdbApiService.setApiKey(this.apiKey);
  }


}
