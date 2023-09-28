import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  test() {
    this.firebaseService.test();
  }
}
