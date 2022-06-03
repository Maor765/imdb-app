import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { IMovie } from '../../interfaces/movie.interface';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {
  constructor(public moviesService: MoviesService) {}

  ngOnInit() {}

  ngOnDestroy(){
    this.moviesService.saveData();
  }

  movies: IMovie[] = [];

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

  public fileOver(event) {
    console.log('fileOver');
  }

  public fileLeave(event) {
    console.log('fileLeave');
  }

  goToLink(imdb_id: string) {
    window.open(`https://www.imdb.com/title/${imdb_id}`, '_blank');
  }

  clearData(){
    this.moviesService.clearData();
  }
}
