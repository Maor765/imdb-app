import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
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

  constructor(public tvsService: TvsIMDBService,
    public filterUtilService:FilterUtilService) {}

  ngOnInit() {}

  ngOnDestroy(){
    this.tvsService.saveData();
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.tvsService.extractTvs(fileEntry);
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
    this.tvsService.clearData();
  }

  
  onChangeSort(){
    // console.log(this.selectedSort);
    if(!this.selectedSort){
      this.tvsService.createTvsData();
    } else {
      this.tvsService.tvData = this.filterUtilService.sortBy(this.selectedSort, this.tvsService.tvData);
      if(this.isAsc){
        this.tvsService.tvData  = this.tvsService.tvData.reverse();
      }
    }
  }

  ascDescChange($event){
    this.tvsService.tvData = this.tvsService.tvData.reverse();
  }

  onChangeFilterInput($event){
    this.tvsService.createTvsData();
    this.tvsService.tvData= this.tvsService.tvData.filter((movie) => {
      return movie.title.toLocaleLowerCase().includes($event.toLocaleLowerCase());
    });
  }

  onChangeGenre(){
    // console.log(this.selectedGenre);
    this.tvsService.createTvsData();
    if(this.selectedGenre){
      this.tvsService.tvData = this.filterUtilService.getAllGenres(this.selectedGenre, this.tvsService.tvData);
    }
  }
}
