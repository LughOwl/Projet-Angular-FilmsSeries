import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NavigerPage } from './naviger.page';

describe('NavigerPage', () => {
  let component: NavigerPage;
  let fixture: ComponentFixture<NavigerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
