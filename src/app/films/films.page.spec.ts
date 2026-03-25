import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilmsPage } from './films.page';

describe('ParametresPage', () => {
  let component: FilmsPage;
  let fixture: ComponentFixture<FilmsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilmsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
