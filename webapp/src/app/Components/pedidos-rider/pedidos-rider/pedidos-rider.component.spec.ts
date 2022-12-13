import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosRiderComponent } from './pedidos-rider.component';

describe('PedidosRiderComponent', () => {
  let component: PedidosRiderComponent;
  let fixture: ComponentFixture<PedidosRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosRiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
