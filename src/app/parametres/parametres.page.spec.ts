import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ParametresPage } from './parametres.page';

describe('ParametresPage', () => {
  let component: ParametresPage;
  let fixture: ComponentFixture<ParametresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParametresPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ParametresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
