import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardOeuvreComponent } from './card-oeuvre.component';

describe('CardOeuvreComponent', () => {
  let component: CardOeuvreComponent;
  let fixture: ComponentFixture<CardOeuvreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CardOeuvreComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardOeuvreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
