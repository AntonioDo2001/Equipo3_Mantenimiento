import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRestaurantesComponent } from './gestion-restaurantes.component';

describe('GestionRestaurantesComponent', () => {
  let component: GestionRestaurantesComponent;
  let fixture: ComponentFixture<GestionRestaurantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRestaurantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRestaurantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
