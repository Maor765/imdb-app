import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
} from 'ngx-file-drop';
import { take } from 'rxjs/operators';
import { OmdbMovie } from 'src/app/interfaces/omdb.movie.interface';
import { FilterUtilService, ISortField } from 'src/app/services/filter-util.service';
import { TvsIMDBService } from 'src/app/services/tvs-imdb.service';

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

  tvsData: Array<OmdbMovie> = [];

  constructor(public tvsService: TvsIMDBService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {
    this.tvsData = this.tvsService.tvsData;
  }

  ngOnDestroy(){
    this.tvsService.saveData(); 
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.tvsService.spinner.show();
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        // console.log(fileEntry);
        this.tvsService.extractTvNames(fileEntry);
      }
    }

    console.log('////////////////FINISH//////////////');
    console.log(this.tvsService.tvsNameMap);

    this.tvsService.getTvData();

    this.tvsService.fetchingDataStatus.pipe(take(1)).subscribe(res => {
      this.tvsData = this.tvsService.tvsData;
      this.tvsService.spinner.hide();
    })
  }


  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.tvsData = [];
    this.tvsService.clearData();
  }

  getGenres(tv) {
    return tv.Genre.split(',');
  }

  
  onChangeSort(){
    if(!this.selectedSort){
      this.tvsData = this.tvsService.tvsData;
    } else {
      this.tvsData = this.filterUtilService.sortBy2(this.selectedSort, this.tvsService.tvsData);
      if(this.isAsc){
        this.tvsData  = this.tvsData.reverse();
      }
    }
  }

  ascDescChange($event){
    this.tvsData = this.tvsData.reverse();
  }

  onChangeFilterInput($event){
    this.tvsData = this.tvsService.tvsData;
    this.tvsData= this.tvsService.tvsData.filter((movie) => {
      return movie.Title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    this.tvsData = this.tvsService.tvsData;
    if(this.selectedGenre){
      this.tvsService.tvsData = this.filterUtilService.getAllGenres2(this.selectedGenre, this.tvsService.tvsData);
    }
  }
}
