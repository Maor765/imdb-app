import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbContainerComponent } from './imdb-container.component';

describe('ImdbContainerComponent', () => {
  let component: ImdbContainerComponent;
  let fixture: ComponentFixture<ImdbContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImdbContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImdbContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
