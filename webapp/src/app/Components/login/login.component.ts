import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';
//import {enc, SHA256} from "crypto-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  avisoEmail: string = "";
  avisoPwd: string = "";
  tipoUser: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;

  constructor(private router: Router, private http: HttpClient) {
    this.funciones = new FuncionesService();
  }

  ngOnInit(): void { }

  acceder() {
    var correoCampo = document.getElementById("email") as HTMLInputElement;
    var pwdCampo = document.getElementById("password") as HTMLInputElement;

    this.avisoEmail = this.funciones.comprobarVacio(correoCampo?.value);
    if (this.avisoEmail === "") { } else { return; }

    if (!this.funciones.validarEmail(correoCampo?.value)) {
      this.avisoEmail = "Formato de correo incorrecto";
      return;
    } else {
      this.avisoEmail = "";
    }

    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd === "") { } else { return; }

    this.avisoEmail = "Iniciando sesión";
    this.peticionHttp(correoCampo?.value, pwdCampo?.value);
  }

  peticionHttp(correo: string, pwd: string): void {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = {
      "correo": correo,
      "pwd": pwd
    };

    const url = this.URL + 'user/login';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Usuario o password desconocidas")) {
          this.avisoEmail = "Usuario o contraseña desconocidas";
        } else {
          window.sessionStorage.removeItem('rol');
          window.sessionStorage.setItem('rol', data);
          //alert(data);
          window.sessionStorage.removeItem('correo');
          window.sessionStorage.setItem('correo', correo);
          window.sessionStorage.removeItem('password');
          window.sessionStorage.setItem('password', pwd);

          this.avisoEmail = "Iniciando sesión";

          if(data === "client"){
            this.router.navigate(['/pedir']);
          }else if(data === "rider"){
            this.router.navigate(['/gestion-rider']);
          }else if(data === "admin"){
            this.router.navigate(['/gestion']);
          }else if(data == "asistente"){
            this.router.navigate(['/atenciontelefonica'])
          }
          else{
            this.router.navigate(['/inicio']);
          }
        }
      },
      error: error => {
        console.log(error);
        alert("Ha ocurrido un error al iniciar sesión");
      }
    });
  }
}
