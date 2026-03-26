import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NaviguerPage } from './naviguer.page';

describe('NaviguerPage', () => {
  let component: NaviguerPage;
  let fixture: ComponentFixture<NaviguerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NaviguerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NaviguerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
