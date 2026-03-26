import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailFilmPage } from './detail-film.page';

describe('DetailFilmPage', () => {
  let component: DetailFilmPage;
  let fixture: ComponentFixture<DetailFilmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFilmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
