import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //llamar a la funcion(parametros)
    expect(component).toBeTruthy();
  });
});

describe('PeticionHttp', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let correoValido: string = "yirmeladmin3@gmail.com";
  let pwdValido: string = "Ho123456";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('PeticionHttp', async () => {
    component.peticionHttp(correoValido, pwdValido);
    expect(component.avisoEmail).toEqual("Iniciando sesión");
  });
});