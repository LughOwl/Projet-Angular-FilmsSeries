import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailOeuvrePage } from './detail-oeuvre.page';

describe('DetailOeuvrePage', () => {
  let component: DetailOeuvrePage;
  let fixture: ComponentFixture<DetailOeuvrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOeuvrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
