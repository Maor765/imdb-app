import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { take } from 'rxjs/operators';
import { OmdbMovie } from 'src/app/interfaces/omdb.movie.interface';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { TvsIMDBService } from 'src/app/services/tvs-imdb.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-imdb-tv',
  templateUrl: './imdb-tv.component.html',
  styleUrls: ['./imdb-tv.component.scss']
})
export class ImdbTvComponent implements OnInit, OnDestroy {

  selectedSort: ISortField;
  selectedGenre;
  isAsc:boolean  = false;
  filterData;

  data: Array<OmdbMovie> = [];

  constructor(public tvsService: TvsIMDBService,
    public spinner: NgxSpinnerService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    this.data = this.tvsService.data;
  }

  ngOnDestroy(){
    this.tvsService.saveData(); 
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.spinner.show();
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.tvsService.extractNames(fileEntry);
      }
    }

    // console.log('////////////////FINISH//////////////');
    // console.log(this.tvsService.tvsNameMap);

    this.tvsService.getData();

    this.tvsService.fetchingDataStatus.pipe(take(1)).subscribe(res => {
      this.data = this.tvsService.data;
      this.spinner.hide();
    })
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.data = [];
    this.tvsService.clearData();
  }

  getGenres(tv) {
    return tv.Genre.split(',');
  }

  
  onChangeSort(){
    if(!this.selectedSort){
      this.data = this.tvsService.data;
    } else {
      this.data = this.filterUtilService.sortBy(this.selectedSort, this.tvsService.data);
      if(this.isAsc){
        this.data  = this.data.reverse();
      }
    }
  }

  ascDescChange($event){
    this.data = this.data.reverse();
  }

  onChangeFilterInput($event){
    this.data = this.tvsService.data;
    this.data= this.tvsService.data.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    if(this.selectedGenre){
      this.data = this.filterUtilService.getAllGenres(this.selectedGenre, this.tvsService.data);
    } else {
      this.data = this.tvsService.data;
    }
  }
}
