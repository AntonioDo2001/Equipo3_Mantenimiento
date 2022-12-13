import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarPedidoAsistenciaTelefComponent } from './realizar-pedido-asistencia-telef.component';

describe('RealizarPedidoAsistenciaTelefComponent', () => {
  let component: RealizarPedidoAsistenciaTelefComponent;
  let fixture: ComponentFixture<RealizarPedidoAsistenciaTelefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizarPedidoAsistenciaTelefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarPedidoAsistenciaTelefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
