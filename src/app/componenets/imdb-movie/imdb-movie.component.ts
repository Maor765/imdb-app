import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { MoviesIMDBService } from './../../services/movies-imdb.service';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';

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

  constructor(
    public moviesService: MoviesIMDBService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
  }

  ngOnDestroy(){
    this.moviesService.saveData();
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.moviesService.extractMovies(fileEntry);
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.moviesService.clearData();
  }

  onChangeSort(){
    if(!this.selectedSort){
      this.moviesService.createMoviesData();
    } else {
      this.moviesService.moviesData = this.filterUtilService.sortBy(this.selectedSort, this.moviesService.moviesData);
      if(this.isAsc){
        this.moviesService.moviesData = this.moviesService.moviesData.reverse();
      }
    }
  }

  ascDescChange($event){
    this.moviesService.moviesData = this.moviesService.moviesData.reverse();
  }

  onChangeFilterInput($event){
    this.moviesService.createMoviesData();
    this.moviesService.moviesData = this.moviesService.moviesData.filter((movie) => {
      return movie.title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    this.moviesService.createMoviesData();
    if(this.selectedGenre){
      this.moviesService.moviesData = this.filterUtilService.getAllGenres(this.selectedGenre, this.moviesService.moviesData);
    }
  }
}
