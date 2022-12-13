import { VariableBinding } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit {
  private contenedor_campos1!: HTMLElement;
  private contenedor_campos2!: HTMLElement;
  private contenedor_campos3!: HTMLElement;
  avisoNombre: string = "";
  avisoApellidos: string = "";
  avisoNif: string = "";
  avisoTlf: string = "";
  avisoDireccion: string = "";
  avisoEmail: string = "";
  avisoPwd: string = "";
  avisoPwdDos: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;

  constructor(private router: Router, private http: HttpClient) {
    this.funciones = new FuncionesService();
  }

  ngOnInit(): void {
    var campo1 = document.getElementById("campos_paso1");
    var campo2 = document.getElementById("campos_paso2");
    var campo3 = document.getElementById("campos_paso3");

    if (campo1 != null) {
      this.contenedor_campos1 = campo1;
    }
    if (campo2 != null) {
      this.contenedor_campos2 = campo2;
    }
    if (campo3 != null) {
      this.contenedor_campos3 = campo3;
    }
  }

  mostrar_paso1() {
    this.contenedor_campos1.classList.remove('oculto');
    this.contenedor_campos2.classList.add('oculto');
    this.contenedor_campos3.classList.add('oculto');
  }

  mostrar_paso2() {
    this.contenedor_campos2.classList.remove('oculto');
    this.contenedor_campos1.classList.add('oculto');
    this.contenedor_campos3.classList.add('oculto');
  }

  mostrar_paso3() {
    this.contenedor_campos3.classList.remove('oculto');
    this.contenedor_campos1.classList.add('oculto');
    this.contenedor_campos2.classList.add('oculto');
  }

  registrar() {
    var nombreCampo = document.getElementById("nombre") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidos") as HTMLInputElement;
    var nifCampo = document.getElementById("nif") as HTMLInputElement;
    var numeroTlfCampo = document.getElementById("telefono") as HTMLInputElement;
    var direccionCampo = document.getElementById("direccion") as HTMLInputElement;
    var usuarioCampo = document.getElementById("email") as HTMLInputElement;
    var pwdCampo = document.getElementById("password") as HTMLInputElement;
    var pwdDosCampo = document.getElementById("password2") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }

    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }

    this.avisoNif = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNif !== "") { errorCampo = true; }

    if (this.funciones.esNumero(numeroTlfCampo?.value)) {
      this.avisoTlf = "";
    } else {
      this.avisoTlf = "Formato incorrecto";
      errorCampo = true;
    }

    this.avisoDireccion = this.funciones.comprobarVacio(direccionCampo?.value);
    if (this.avisoDireccion !== "") { errorCampo = true; }

    if (!this.funciones.validarEmail(usuarioCampo?.value)) {
      this.avisoEmail = "Formato de correo incorrecto";
      errorCampo = true;
    } else {
      this.avisoEmail = "";
    }

    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }

    this.avisoPwdDos = this.funciones.comprobarVacio(pwdDosCampo?.value);
    if (this.avisoPwdDos !== "") { errorCampo = true; }

    if (pwdCampo?.value !== pwdDosCampo?.value) {
      this.avisoPwdDos = "Las contraseñas no coinciden";
    }
    
    if (!errorCampo) {
      this.peticionHttp(nombreCampo?.value, apellidosCampo?.value, nifCampo?.value,
        numeroTlfCampo?.value, direccionCampo?.value, usuarioCampo?.value, pwdCampo?.value,
        pwdDosCampo?.value);
    }
  }

  peticionHttp(nombre: string, apellidos: string, nif: string, telefono: string,
    direccion: string, correo: string, pwd1: string, pwd2: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "nombre": nombre,
      "apellidos": apellidos,
      "nif": nif,
      "telefono": telefono,
      "direccion": direccion,
      "correo": correo,
      "pwd1": pwd1,
      "pwd2": pwd2
    };

    const url = this.URL + 'user/register';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Registro completado")) {
          alert("Usuario registrado correctamente");
          this.router.navigate(['/login']);
        } else {
          alert(data);
        }
      },
      error: error => {
        console.log(error);
        alert("Ha ocurrido un error al registrar al usuario");
      }
    });
  }
}
