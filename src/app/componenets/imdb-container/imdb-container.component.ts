import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imdb-container',
  templateUrl: './imdb-container.component.html',
  styleUrls: ['./imdb-container.component.scss'],
})
export class ImdbContainerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  handleChange(e) {
    var index = e.index;
    switch (index) {
      case 0:
        this.router.navigate(['movies']);
        break;
      case 1:
        this.router.navigate(['tvs']);
        break;
      default:
        break;
    }
  }
}
