import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRidersComponent } from './gestion-riders.component';

describe('GestionRidersComponent', () => {
  let component: GestionRidersComponent;
  let fixture: ComponentFixture<GestionRidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRidersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
