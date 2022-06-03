import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbApiComponent } from './imdb-api.component';

describe('ImdbApiComponent', () => {
  let component: ImdbApiComponent;
  let fixture: ComponentFixture<ImdbApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImdbApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImdbApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
