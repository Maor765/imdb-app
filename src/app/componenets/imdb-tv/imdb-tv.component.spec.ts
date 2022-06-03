import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbTvComponent } from './imdb-tv.component';

describe('ImdbTvComponent', () => {
  let component: ImdbTvComponent;
  let fixture: ComponentFixture<ImdbTvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImdbTvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImdbTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
