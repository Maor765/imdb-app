import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { MoviesIMDBService } from './../../services/movies-imdb.service';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OmdbMovie } from 'src/app/interfaces/omdb.movie.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-imdb-movie',
  templateUrl: './imdb-movie.component.html',
  styleUrls: ['./imdb-movie.component.scss']
})
export class ImdbMovieComponent implements OnInit, OnDestroy {

  selectedSort: ISortField;
  selectedGenre;
  isAsc:boolean  = false;
  filterData;

  data: Array<OmdbMovie> = [];

  constructor(
    public moviesService: MoviesIMDBService,
    public spinner: NgxSpinnerService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    this.data = this.moviesService.data;
  }

  ngOnDestroy(){
    this.moviesService.saveData();
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.spinner.show();
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.moviesService.extractNames(fileEntry);
      }
    }

    // console.log('////////////////FINISH//////////////');
    // console.log(this.tvsService.tvsNameMap);

    this.moviesService.getData();

    this.moviesService.fetchingDataStatus.pipe(take(1)).subscribe(res => {
      this.data = this.moviesService.data;
      this.spinner.hide();
    })
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.data = [];
    this.moviesService.clearData();
  }

  onChangeSort(){
    if(!this.selectedSort){
      this.data = this.moviesService.data;
    } else {
      this.data = this.filterUtilService.sortBy(this.selectedSort, this.moviesService.data);
      if(this.isAsc){
        this.data  = this.data.reverse();
      }
    }
  }

  ascDescChange($event){
    this.data = this.data.reverse();
  }

  onChangeFilterInput($event){
    this.data = this.moviesService.data;
    this.data= this.moviesService.data.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    if(this.selectedGenre){
      this.data = this.filterUtilService.getAllGenres(this.selectedGenre, this.moviesService.data);

    } else {
      this.data = this.moviesService.data;
    }
  }
}
