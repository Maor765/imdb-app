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

  moviesData: Array<OmdbMovie> = [];

  constructor(
    public moviesService: MoviesIMDBService,
    public spinner: NgxSpinnerService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    this.moviesData = this.moviesService.moviesData2;
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
        this.moviesService.extractMovies(fileEntry);
      }
    }

    // console.log('////////////////FINISH//////////////');
    // console.log(this.tvsService.tvsNameMap);

    this.moviesService.getMoviesData();

    this.moviesService.fetchingDataStatus.pipe(take(1)).subscribe(res => {
      this.moviesData = this.moviesService.moviesData2;
      this.spinner.hide();
    })
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.moviesData = [];
    this.moviesService.clearData();
  }

  onChangeSort(){
    if(!this.selectedSort){
      this.moviesData = this.moviesService.moviesData2;
    } else {
      this.moviesData = this.filterUtilService.sortBy(this.selectedSort, this.moviesService.moviesData2);
      if(this.isAsc){
        this.moviesData  = this.moviesData.reverse();
      }
    }
  }

  ascDescChange($event){
    this.moviesData = this.moviesData.reverse();
  }

  onChangeFilterInput($event){
    this.moviesData = this.moviesService.moviesData2;
    this.moviesData= this.moviesService.moviesData2.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    if(this.selectedGenre){
      this.moviesData = this.filterUtilService.getAllGenres(this.selectedGenre, this.moviesService.moviesData2);

    } else {
      this.moviesData = this.moviesService.moviesData2;
    }
  }
}
