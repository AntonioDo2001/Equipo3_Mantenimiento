
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/Entities/admin';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-gestion-admins',
  templateUrl: './gestion-admins.component.html',
  styleUrls: ['./gestion-admins.component.css']
})
export class GestionAdminsComponent implements OnInit {
  avisoNombre: string = "";
  avisoApellidos: string = "";
  avisoZona: string = "";
  avisoNIF: string = "";
  avisoCorreo: string = "";
  avisoPwd: string = "";
  avisoPwd2: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;

  listaAdmins: Admin[] = [];

  constructor(private router: Router, private http: HttpClient) {
    this.funciones = new FuncionesService();
  }

  ngOnInit(): void {
    this.peticionGetHttp();
  }

  peticionGetHttp(): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'user/getAdmins';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data == "No tienes acceso a este servicio") {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else {
          this.listaAdmins = [];
          if (data.length == 0) {
            //alert("No hay admins");
          } else {
            var listaResJSON = data.split(";");
            for (let i = 0; i < listaResJSON.length; i++) {
              //console.log(listaResJSON[i]);
              this.listaAdmins.push(new Admin(listaResJSON[i],i))
              console.log(this.listaAdmins[i]);
            }
          }
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar los administradores");
        //alert(error.error);
      }
    });
  }

  aceptarCambiosCrear() {
    var nombreCampo = document.getElementById("nombreA") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosA") as HTMLInputElement;
    var zonaCampo = document.getElementById("zonaA") as HTMLInputElement;
    var nifCampo = document.getElementById("nifA") as HTMLInputElement;
    var emailCampo = document.getElementById("emailA") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordA") as HTMLInputElement;
    var pwdCampo2 = document.getElementById("passwordA2") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoZona = this.funciones.comprobarVacio(zonaCampo?.value);
    if (this.avisoZona !== "") { errorCampo = true; }
    this.avisoNIF = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNIF !== "") { errorCampo = true; }
    this.avisoCorreo = this.funciones.comprobarVacio(emailCampo?.value);
    if (this.avisoCorreo !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }
    this.avisoPwd2 = this.funciones.comprobarVacio(pwdCampo2?.value);
    if (this.avisoPwd2 !== "") { errorCampo = true; }

    if (!this.funciones.validarEmail(emailCampo?.value)) {
      alert("Error formato correo");
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpCrear(nombreCampo?.value, apellidosCampo?.value,
        zonaCampo?.value, nifCampo?.value, emailCampo?.value, pwdCampo?.value, pwdCampo2?.value);
    }
  }

  aceptarCambiosActualizar() {
    var nombreCampo = document.getElementById("nombreA") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosA") as HTMLInputElement;
    var zonaCampo = document.getElementById("zonaA") as HTMLInputElement;
    var nifCampo = document.getElementById("nifA") as HTMLInputElement;
    var emailCampo = document.getElementById("emailA") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordA") as HTMLInputElement;
    var pwdCampo2 = document.getElementById("passwordA2") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoZona = this.funciones.comprobarVacio(zonaCampo?.value);
    if (this.avisoZona !== "") { errorCampo = true; }
    this.avisoNIF = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNIF !== "") { errorCampo = true; }
    this.avisoCorreo = this.funciones.comprobarVacio(emailCampo?.value);
    if (this.avisoCorreo !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }
    this.avisoPwd2 = this.funciones.comprobarVacio(pwdCampo2?.value);
    if (this.avisoPwd2 !== "") { errorCampo = true; }

    if (!this.funciones.validarEmail(emailCampo?.value)) {
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpActualizar(nombreCampo?.value, apellidosCampo?.value,
        zonaCampo?.value, nifCampo?.value, emailCampo?.value, pwdCampo?.value, pwdCampo2?.value);
    }
  }

  cancelarCambiosCrear() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_admin', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_add_a', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaAdmins');
  }

  cancelarCambiosActualizar() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_admin', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_udt_a', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaAdmins');
  }

  activarCamposCrear() {
    this.disabledTodos(false); //habilitar campos
    this.vaciarCampos(); //vaciar campos
    this.funciones.apagarElementosLista('listaAdmins');
    this.funciones.ocultarBtn('add_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_add_a', false); //mostrar btns_aceptar_cancelar    
  }

  activarCamposActualizar() {
    this.disabledTodos(false); //habilitar campos
    this.funciones.disabledID('emailA', true);
    this.vaciarAvisos(); //vaciar campos
    this.funciones.ocultarBtn('add_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_admin', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_udt_a', false); //mostrar btns_aceptar_cancelar
  }

  eliminar() {
    var correoCampo = document.getElementById("emailA") as HTMLInputElement;

    if (confirm("¿Seguro que quiere eliminar el administrador?")) {
      this.peticionHttpEliminar(correoCampo?.value);
      this.dejarVacio();
      this.peticionGetHttp();
      this.funciones.apagarElementosLista('listaAdmins');
    } else {
      //cancelar
    }
  }

  peticionHttpEliminar(correo: string) {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correo": correo,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'user/eliminarUsuario';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese usuario en la base de datos");
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else {
          alert("Administrador eliminado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_admin", false);
          this.funciones.ocultarBtn("cont_confirm_add_a", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaAdmins');
        }
      }, error: error => {
        alert("Ha ocurrido un error al eliminar el administrador");
      }
    });
  }

  peticionHttpCrear(nombre: string, apellidos: string, zona: string,
    nif: string, correo: string, pwd: string, pwd2: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correo": correo,
      "pwd1": pwd,
      "pwd2": pwd2,
      "apellidos": apellidos,
      "nif": nif,
      "nombre": nombre,
      "zona": zona,
      "rol": "admin",
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'user/crearUsuario';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Ya existe un usuario con ese correo")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("contraseña")) {
          alert(data);
        } else {
          alert("Administrador creado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_admin", false);
          this.funciones.ocultarBtn("cont_confirm_add_a", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaAdmins');
        }
      }, error: error => {
        alert("Ha ocurrido un error al introducir el administrador");
        //alert(error.error);
      }
    });

  }

  peticionHttpActualizar(nombre: string, apellidos: string, zona: string,
    nif: string, correo: string, pwd: string, pwd2: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correo": correo,
      "pwd1": pwd,
      "pwd2": pwd2,
      "apellidos": apellidos,
      "nif": nif,
      "nombre": nombre,
      "zona": zona,
      "rol": "admin",
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };
    console.log(body);
    

    let url = this.URL + 'user/actualizarUsuario/';
    url += correo;
    console.log(url);
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese usuario en la base de datos");
        } else if (data.includes("contraseña")) {
          alert(data);
        } else {
          alert("Administrador actualizado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_admin", false);
          this.funciones.ocultarBtn("cont_confirm_udt_a", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaAdmins');
        }
      }, error: error => {
        alert("Ha ocurrido un error al actualizar el administrador");
        //alert(error.error);
      }
    });
  }

  dejarVacio() {
    this.vaciarAvisos();
    this.vaciarCampos();
  }

  vaciarCampos() {
    this.funciones.asignarValorID("nombreA", "");
    this.funciones.asignarValorID("apellidosA", "");
    this.funciones.asignarValorID("zonaA", "");
    this.funciones.asignarValorID("nifA", "");
    this.funciones.asignarValorID("emailA", "");
    this.funciones.asignarValorID("passwordA", "");
    this.funciones.asignarValorID("passwordA2", "");
  }

  vaciarAvisos() {
    this.avisoNombre = "";
    this.avisoApellidos = "";
    this.avisoNIF = "";
    this.avisoZona = "";
    this.avisoCorreo = "";
    this.avisoPwd = "";
    this.avisoPwd2 = "";
  }

  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  disabledTodos(valor: boolean) {
    this.funciones.disabledID('nombreA', valor);
    this.funciones.disabledID('apellidosA', valor);
    this.funciones.disabledID('zonaA', valor);
    this.funciones.disabledID('nifA', valor);
    this.funciones.disabledID('emailA', valor);
    this.funciones.disabledID('passwordA', valor);
    this.funciones.disabledID('passwordA2', valor);
  }

  onSelect(element: Admin) {
    this.disabledTodos(true);
    console.log(element);

    this.funciones.apagarElementosLista('listaAdmins');
    this.funciones.resaltarElementoLista('listaAdmins', element.pos);

    this.funciones.asignarValorID('nombreA', element.nombre);
    this.funciones.asignarValorID('apellidosA', element.apellidos);
    this.funciones.asignarValorID('nifA', element.nif);
    this.funciones.asignarValorID('zonaA', element.zona);
    this.funciones.asignarValorID('emailA', element.correo);
    this.funciones.asignarValorID('passwordA', element.pwd);
    this.funciones.asignarValorID('passwordA2', element.pwd);

    this.funciones.ocultarBtn("cont_confirm_add_a", true);
    this.funciones.ocultarBtn("cont_confirm_udt_a", true);
    this.funciones.ocultarBtn("add_admin", false);
    this.funciones.ocultarBtn("update_admin", false);
    this.funciones.ocultarBtn("delete_admin", false);
  }
}

