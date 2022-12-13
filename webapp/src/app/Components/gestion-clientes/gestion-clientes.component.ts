import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/Entities/cliente';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  avisoNombre: string = "";
  avisoApellidos: string = "";
  avisoNIF: string = "";
  avisoTel: string = "";
  avisoCorreo: string = "";
  avisoPwd: string = "";
  avisoDireccion: string = "";
  avisoCuenta: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;

  listaClientes: Cliente[] = [];
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

    const url = this.URL + 'user/getClients';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else {
          this.listaClientes = [];
          if (data.length == 0) {
            //alert("No hay clientes");
          } else {
            var listaResJSON = data.split(";");
            for (let i = 0; i < listaResJSON.length; i++) {
              //console.log(listaResJSON[i]);
              this.listaClientes.push(new Cliente(listaResJSON[i],i))
              console.log(this.listaClientes[i]);
            }
          }
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar los clientes");
        //alert(error.error);
      }
    });
  }

  aceptarCambiosActualizar() {
    var nombreCampo = document.getElementById("nombreC") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosC") as HTMLInputElement;
    var nifCampo = document.getElementById("nifC") as HTMLInputElement;
    var telCampo = document.getElementById("telC") as HTMLInputElement;
    var emailCampo = document.getElementById("emailC") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordC") as HTMLInputElement;
    var direccionCampo = document.getElementById("direccionC") as HTMLInputElement;
    var activoCampo = document.getElementById("activaC") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoTel = this.funciones.comprobarVacio(telCampo?.value);
    if (this.avisoTel !== "") { errorCampo = true; }
    this.avisoNIF = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNIF !== "") { errorCampo = true; }
    this.avisoCorreo = this.funciones.comprobarVacio(emailCampo?.value);
    if (this.avisoCorreo !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }
    this.avisoDireccion = this.funciones.comprobarVacio(direccionCampo?.value);
    if (this.avisoDireccion !== "") { errorCampo = true; }



    if (!this.funciones.validarEmail(emailCampo?.value)) {
      errorCampo = true;
    }

    if (this.funciones.esNumero(telCampo?.value)) {
      this.avisoTel = "";
    } else {
      this.avisoTel = "Formato incorrecto";
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpActualizar(nombreCampo?.value, apellidosCampo?.value,
        telCampo?.value, nifCampo?.value, emailCampo?.value, pwdCampo?.value, direccionCampo?.value,activoCampo?.checked);
    }
  }

  cancelarCambiosActualizar() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('cont_confirm_udt_c', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaClientes');
  }

  activarCamposActualizar() {
    this.disabledTodos(false); //habilitar campos
    this.funciones.disabledID('emailC', true);
    this.vaciarAvisos(); //vaciar campos
    this.funciones.ocultarBtn('update_clientes', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_clientes', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_udt_c', false); //mostrar btns_aceptar_cancelar
  }

  eliminar() {
    var correoCampo = document.getElementById("emailC") as HTMLInputElement;

    if (confirm("¿Seguro que quiere eliminar el cliente?")) {
      this.peticionHttpEliminar(correoCampo?.value);
      this.dejarVacio();
      this.peticionGetHttp();
      this.funciones.apagarElementosLista('listaClientes');
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
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese cliente en la base de datos");
        } else if (data.includes("El cliente tiene pedidos pendientes")) {
          alert(data);
        } else {
          alert("Cliente eliminado exitosamente");
          this.dejarVacio();
          //this.funciones.ocultarBtn("cont_confirm_add_c", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaClientes');
        }
      }, error: error => {
        alert("Ha ocurrido un error al eliminar el cliente");
      }
    });
  }

  disabledTodos(valor: boolean) {
    this.funciones.disabledID('nombreC', valor);
    this.funciones.disabledID('apellidosC', valor);
    this.funciones.disabledID('telC', valor);
    this.funciones.disabledID('nifC', valor);
    this.funciones.disabledID('emailC', valor);
    this.funciones.disabledID('passwordC', valor);
    this.funciones.disabledID('direccionC', valor);
    this.funciones.disabledID('activaC',valor)
    //this.funciones.disabledID('', valor);
  }

  peticionHttpActualizar(nombre: string, apellidos: string, telefono: string,
    nif: string, correo: string, pwd: string, direccion: string, activo:boolean): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correo": correo,
      "pwd1": pwd,
      "pwd2": pwd,
      "apellidos": apellidos,
      "nif": nif,
      "nombre": nombre,
      "telefono": telefono,
      "direccion": direccion,
      "rol": "client",
      "activo": String(activo),
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    console.log(body.correoAcceso);

    let url = this.URL + 'user/actualizarUsuario/';
    url += correo;
    console.log(url);
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese cliente en la base de datos");
        } else if (data.includes("contraseña")) {
          alert(data);
        } else {
          alert("Cliente actualizado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("cont_confirm_udt_c", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaClientes');
        }
      }, error: error => {
        //alert("Ha ocurrido un error al actualizar el cliente");
        alert(error.error);
      }
    });
  }

  dejarVacio() {
    this.vaciarAvisos();
    this.vaciarCampos();
  }

  vaciarCampos() {
    this.funciones.asignarValorID("nombreC", "");
    this.funciones.asignarValorID("apellidosC", "");
    this.funciones.asignarValorID("telC", "");
    this.funciones.asignarValorID("nifC", "");
    this.funciones.asignarValorID("emailC", "");
    this.funciones.asignarValorID("passwordC", "");
    this.funciones.asignarValorID("direccionC", "");
    this.funciones.asignarValorID("activaC", "");
  }

  vaciarAvisos() {
    this.avisoNombre = "";
    this.avisoApellidos = "";
    this.avisoNIF = "";
    this.avisoTel = "";
    this.avisoCorreo = "";
    this.avisoPwd = "";
    this.avisoDireccion = "";
    this.avisoCuenta = "";
  }

  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  onSelect(element: Cliente) {
    this.disabledTodos(true);
    console.log(element);

    this.funciones.apagarElementosLista('listaClientes');
    this.funciones.resaltarElementoLista('listaClientes', element.pos);

    this.funciones.asignarValorID('nombreC', element.nombre);
    this.funciones.asignarValorID('apellidosC', element.apellidos);
    this.funciones.asignarValorID('nifC', element.nif);
    this.funciones.asignarValorID('telC', String(element.telefono));
    this.funciones.asignarValorID('emailC', element.correo);
    this.funciones.asignarValorID('passwordC', element.pwd);
    this.funciones.asignarValorID('direccionC', element.direccion);
    this.funciones.seleccionarRadio('activaC', element.activo);

    this.funciones.ocultarBtn("cont_confirm_udt_c", true);
    this.funciones.ocultarBtn("update_clientes", false);
    this.funciones.ocultarBtn("delete_clientes", false);
  }
}
