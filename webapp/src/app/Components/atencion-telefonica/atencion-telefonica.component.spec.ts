import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionTelefonicaComponent } from './atencion-telefonica.component';

describe('AtencionTelefonicaComponent', () => {
  let component: AtencionTelefonicaComponent;
  let fixture: ComponentFixture<AtencionTelefonicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionTelefonicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtencionTelefonicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
