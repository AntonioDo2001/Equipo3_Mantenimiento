
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rider } from 'src/app/Entities/rider';
import { Url } from 'src/app/Entities/url';
import { Valoracion } from 'src/app/Entities/valoracion';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-gestion-riders',
  templateUrl: './gestion-riders.component.html',
  styleUrls: ['./gestion-riders.component.css']
})

export class GestionRidersComponent implements OnInit {
  avisoNombre: string = "";
  avisoApellidos: string = "";
  avisoNIF: string = "";
  avisoCorreo: string = "";
  avisoPwd: string = "";
  avisoTipoVeh: string = "";
  avisoMatricula: string = "";
  avisoCarnet: string = "";
  avisoActivo: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;

  riderSelected: string = "";
  riderSelectCorreo: string = "";
  listaRiders: Rider[] = [];
  listaValoracionesRid: Valoracion[] = [];

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

    const url = this.URL + 'user/getRiders';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else {
          this.listaRiders = [];
          if (data.length == 0) {
            //alert("No hay riders");
          } else {
            var listaResJSON = data.split(";");
            for (let i = 0; i < listaResJSON.length; i++) {
              //console.log(listaResJSON[i]);
              this.listaRiders.push(new Rider(listaResJSON[i], i))
              console.log(this.listaRiders[i]);
            }
          }
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar los riders");
        //alert(error.error);
      }
    });
  }

  aceptarCambiosCrear() {
    var errorCampo = false;
    var nombreCampo = document.getElementById("nombreR") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosR") as HTMLInputElement;
    var nifCampo = document.getElementById("nifR") as HTMLInputElement;
    var emailCampo = document.getElementById("emailR") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordR") as HTMLInputElement;

    var cocheCampo = document.getElementById("cocheR") as HTMLInputElement;
    var motoCampo = document.getElementById("motoR") as HTMLInputElement;
    var biciCampo = document.getElementById("biciR") as HTMLInputElement;
    var patineteCampo = document.getElementById("patineteR") as HTMLInputElement;

    var matriculaCampo = document.getElementById("matriculaR") as HTMLInputElement;
    var carnetCampo = document.getElementById("carnetR") as HTMLInputElement;

    var activoCampo = document.getElementById("activoR") as HTMLInputElement;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoNIF = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNIF !== "") { errorCampo = true; }
    this.avisoCorreo = this.funciones.comprobarVacio(emailCampo?.value);
    if (this.avisoCorreo !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }

    var tipoVeh = 0;
    if (this.funciones.comprobarSeleccionado(cocheCampo)) {
      tipoVeh = 1;
    } else if (this.funciones.comprobarSeleccionado(motoCampo)) {
      tipoVeh = 2;
    } else if (this.funciones.comprobarSeleccionado(biciCampo)) {
      tipoVeh = 3;
    } else if (this.funciones.comprobarSeleccionado(patineteCampo)) {
      tipoVeh = 4;
    }

    if (tipoVeh == 0) {
      this.avisoTipoVeh = "Selecciona un tipo de vehículo";
      errorCampo = true;
    } else {
      this.avisoTipoVeh = "";
    }

    if (!this.funciones.validarEmail(emailCampo?.value)) {
      alert("Error formato correo");
      errorCampo = true;
    }

    if (tipoVeh == 1 || tipoVeh == 2) {
      this.avisoMatricula = this.funciones.comprobarVacio(matriculaCampo?.value);
      if (this.avisoMatricula !== "") { errorCampo = true; }
      if (!carnetCampo.checked) {
        errorCampo = true;
        this.avisoCarnet = "Este tipo de vehiculo necesita carnet";
      } else {
        this.avisoCarnet = "";
      }
    }

    if (!errorCampo) {
      this.peticionHttpCrear(nombreCampo?.value, apellidosCampo?.value, nifCampo?.value,
        emailCampo?.value, pwdCampo?.value, tipoVeh, matriculaCampo?.value, carnetCampo?.checked, activoCampo?.checked);
    }
  }

  peticionHttpCrear(nombre: string, apellidos: string, nif: string, correo: string,
    pwd: string, tipoVeh: number, matricula: string, carnet: boolean, activo: boolean): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "nombre": nombre,
      "apellidos": apellidos,
      "nif": nif,
      "valoracion": "0",
      "correo": correo,
      "pwd1": pwd,
      "pwd2": pwd,
      "tipoVehiculo": String(tipoVeh),
      "matricula": matricula,
      "carnet": String(carnet),
      "activo": String(activo),
      "rol": "rider",
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
          alert("Rider creado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_rider", false);
          this.funciones.ocultarBtn("cont_confirm_add_r", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaRiders');
        }
      }, error: error => {
        alert("Ha ocurrido un error al introducir el administrador");
        //alert(error.error);
      }
    });

  }

  dejarVacio() {
    this.vaciarAvisos();
    this.vaciarCampos();

  }

  vaciarCampos() {
    this.funciones.asignarValorID("nombreR", "");
    this.funciones.asignarValorID("apellidosR", "");
    this.funciones.asignarValorID("nifR", "");
    this.funciones.asignarValorID("valoracionR", "0");
    this.funciones.asignarValorID("emailR", "");
    this.funciones.asignarValorID("passwordR", "");
    this.funciones.asignarValorID("matriculaR", "");
    this.funciones.seleccionarRadio("carnetR", false);
    this.funciones.seleccionarRadio("activoR", true);
  }

  vaciarAvisos() {
    this.avisoNombre = "";
    this.avisoApellidos = "";
    this.avisoNIF = "";
    this.avisoCorreo = "";
    this.avisoPwd = "";
    this.avisoTipoVeh = "";
    this.avisoMatricula = "";
    this.avisoCarnet = "";
    this.avisoActivo = "";
  }

  aceptarCambiosActualizar() {
    var errorCampo = false;
    var nombreCampo = document.getElementById("nombreR") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosR") as HTMLInputElement;
    var nifCampo = document.getElementById("nifR") as HTMLInputElement;
    var emailCampo = document.getElementById("emailR") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordR") as HTMLInputElement;

    var cocheCampo = document.getElementById("cocheR") as HTMLInputElement;
    var motoCampo = document.getElementById("motoR") as HTMLInputElement;
    var biciCampo = document.getElementById("biciR") as HTMLInputElement;
    var patineteCampo = document.getElementById("patineteR") as HTMLInputElement;

    var matriculaCampo = document.getElementById("matriculaR") as HTMLInputElement;
    var carnetCampo = document.getElementById("carnetR") as HTMLInputElement;
    var activoCampo = document.getElementById("activoR") as HTMLInputElement;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoNIF = this.funciones.comprobarVacio(nifCampo?.value);
    if (this.avisoNIF !== "") { errorCampo = true; }
    this.avisoCorreo = this.funciones.comprobarVacio(emailCampo?.value);
    if (this.avisoCorreo !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }

    var tipoVeh = 0;
    if (this.funciones.comprobarSeleccionado(cocheCampo)) {
      tipoVeh = 1;
    } else if (this.funciones.comprobarSeleccionado(motoCampo)) {
      tipoVeh = 2;
    } else if (this.funciones.comprobarSeleccionado(biciCampo)) {
      tipoVeh = 3;
    } else if (this.funciones.comprobarSeleccionado(patineteCampo)) {
      tipoVeh = 4;
    }

    if (tipoVeh == 0) {
      this.avisoTipoVeh = "Selecciona un tipo de vehículo";
      errorCampo = true;
    } else {
      this.avisoTipoVeh = "";
    }

    if (!this.funciones.validarEmail(emailCampo?.value)) {
      errorCampo = true;
    }

    if (tipoVeh == 1 || tipoVeh == 2) {
      this.avisoMatricula = this.funciones.comprobarVacio(matriculaCampo?.value);
      if (this.avisoMatricula !== "") { errorCampo = true; }
      if (!carnetCampo.checked) {
        errorCampo = true;
        this.avisoCarnet = "Este tipo de vehiculo necesita carnet";
      } else {
        this.avisoCarnet = "";
      }
    }

    if (!errorCampo) {
      this.peticionHttpActualizar(nombreCampo?.value, apellidosCampo?.value, nifCampo?.value,
        emailCampo?.value, pwdCampo?.value, tipoVeh, matriculaCampo?.value, carnetCampo?.checked, activoCampo?.checked);
    }
  }

  peticionHttpActualizar(nombre: string, apellidos: string, nif: string, correo: string,
    pwd: string, tipoVeh: number, matricula: string, carnet: boolean, cuenta: boolean): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "nombre": nombre,
      "apellidos": apellidos,
      "nif": nif,
      "valoracion": "0",
      "correo": correo,
      "pwd1": pwd,
      "pwd2": pwd,
      "tipoVehiculo": String(tipoVeh),
      "matricula": matricula,
      "carnet": String(carnet),
      "activo": String(cuenta),
      "rol": "rider",
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    let url = this.URL + 'user/actualizarUsuario/';
    url += correo;
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese usuario en la base de datos");
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("contraseña")) {
          alert(data);
        }
        else {
          alert("Rider actualizado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_rider", false);
          this.funciones.ocultarBtn("cont_confirm_udt_r", true);
          this.peticionGetHttp();
          alert(data)
          this.funciones.apagarElementosLista('listaRiders');
        }
      }, error: error => {
        alert("Ha ocurrido un error al actualizar el rider");
        //alert(error.error);
      }
    });
  }

  cancelarCambiosCrear() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_rider', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_add_r', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaRiders');
  }

  cancelarCambiosActualizar() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_rider', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_udt_r', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaRiders');
  }

  activarCamposCrear() {
    this.disabledTodos(false); //habilitar campos
    this.vaciarCampos(); //vaciar campos
    this.funciones.ocultarBtn('add_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_add_r', false); //mostrar btns_aceptar_cancelar 
    this.funciones.disabledID('activoR', true);
  }

  activarCamposActualizar() {
    this.disabledTodos(false); //habilitar campos
    this.funciones.disabledID('emailR', true);
    this.vaciarAvisos(); //vaciar campos
    this.funciones.ocultarBtn('add_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_rider', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_udt_r', false); //mostrar btns_aceptar_cancelar
  }

  eliminar() {
    var correoCampo = document.getElementById("emailR") as HTMLInputElement;

    if (confirm("¿Seguro que quiere eliminar el rider?")) {
      this.peticionHttpEliminar(correoCampo?.value);
      this.dejarVacio();
      this.peticionGetHttp();
      this.funciones.apagarElementosLista('listaRiders');
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
        } else if (data.includes("El rider esta asignado a un pedido")) {
          alert(data);
        } else {
          alert("Rider eliminado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_rider", false);
          this.funciones.ocultarBtn("cont_confirm_add_r", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaRiders');
        }

      }, error: error => {
        alert("Ha ocurrido un error al eliminar el rider");
      }
    });
  }

  disabledTodos(valor: boolean) {
    this.funciones.disabledID('nombreR', valor);
    this.funciones.disabledID('apellidosR', valor);
    this.funciones.disabledID('nifR', valor);
    this.funciones.disabledID('emailR', valor);
    this.funciones.disabledID('passwordR', valor);

    this.funciones.disabledID('cocheR', valor);
    this.funciones.disabledID('motoR', valor);
    this.funciones.disabledID('biciR', valor);
    this.funciones.disabledID('patineteR', valor);

    this.funciones.disabledID('matriculaR', valor);
    this.funciones.disabledID('carnetR', valor);
    this.funciones.disabledID('activoR', valor);
  }


  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  onSelect(element: Rider) {
    this.disabledTodos(true);
    console.log(element);
    this.riderSelected = element.nombre;
    this.riderSelectCorreo = element.correo;
    this.cerrarVentanaValoracionesRid();

    this.funciones.apagarElementosLista('listaRiders');
    this.funciones.resaltarElementoLista('listaRiders', element.pos);

    this.funciones.asignarValorID('nombreR', element.nombre);
    this.funciones.asignarValorID('apellidosR', element.apellidos);
    this.funciones.asignarValorID('nifR', element.nif);
    this.funciones.asignarValorID('emailR', element.correo);
    this.funciones.asignarValorID('passwordR', element.pwd);
    //this.funciones.asignarValorID('valoracionR', String(element.valoracion));
    this.peticionGetHttpValoracionRiderMedia();

    this.funciones.seleccionarRadio('cocheR', false);
    this.funciones.seleccionarRadio('motoR', false);
    this.funciones.seleccionarRadio('biciR', false);
    this.funciones.seleccionarRadio('patineteR', false);

    if (element.tipoVehiculo == 1) {
      this.funciones.seleccionarRadio('cocheR', true);
    } else if (element.tipoVehiculo == 2) {
      this.funciones.seleccionarRadio('motoR', true);
    } else if (element.tipoVehiculo == 3) {
      this.funciones.seleccionarRadio('biciR', true);
    } else if (element.tipoVehiculo == 4) {
      this.funciones.seleccionarRadio('patineteR', true);
    }

    this.funciones.asignarValorID('matriculaR', element.matricula);

    this.funciones.seleccionarRadio('carnetR', element.carnet);
    this.funciones.seleccionarRadio('activoR', element.cuenta);

    this.funciones.ocultarBtn("cont_confirm_add_r", true);
    this.funciones.ocultarBtn("cont_confirm_udt_r", true);
    this.funciones.ocultarBtn("add_rider", false);
    this.funciones.ocultarBtn("update_rider", false);
    this.funciones.ocultarBtn("delete_rider", false);
  }

  cerrarVentanaValoracionesRid() {
    this.funciones.ocultarBtn('contenedor_valoracionesRid', true);
  }

  mostrarValoracionesRid() {
    if (this.riderSelected != "") {
      this.funciones.ocultarBtn('contenedor_valoracionesRid', false);
      this.peticionHttpGetValoracionesRiderDetalladas();
    } else {
      alert("Selecciona un rider");
    }
  }

  peticionGetHttpValoracionRiderMedia(): void {
    if (this.riderSelected !== "") {
      const headers = {
        'Content-Type': 'application/json'
      };
      const body = {
        "rider": this.riderSelectCorreo,
        "correoAcceso": window.sessionStorage.getItem('correo'),
        "passwordAcceso": window.sessionStorage.getItem('password')
      };

      console.log(body);
      

      const url = this.URL + 'pedido/consultarValoracionRiderMedia';
      this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
        next: data => {
          console.log("DATOS:")
          console.log(data);

          if (data.includes("El rider no tiene valoraciones")) {
            this.funciones.asignarValorID('valoracionR', "0.0");
            //alert(data);
          } else {
            this.funciones.asignarValorID('valoracionR', String(Number(data).toFixed(1)));
          }
        }, error: error => {
          alert("Ha ocurrido un error al cargar la valoración del rider");
          console.log(error.message);
        }
      });
    } else {
      alert("Selecciona un rider");
    }
  }

  peticionHttpGetValoracionesRiderDetalladas() {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "rider": this.riderSelectCorreo,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarValoracionRider';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaValoracionesRid = [];
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);

        } else if (data.includes(this.riderSelectCorreo + " no tiene valoraciones")) {
          this.funciones.ocultarBtn('contenedor_valoracionesRid', true);
          alert(data + " detalladas");
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ese rider")) {
          alert(data);
        } else {
          var listaValJSON = data.split(";;;");
          for (let i = 0; i < listaValJSON.length; i++) {
            let valoracion = new Valoracion(listaValJSON[i], i);
            this.listaValoracionesRid.push(valoracion);
            console.log(this.listaValoracionesRid[i]);

          }
        };

      }, error: error => {
        alert("Ha ocurrido un error al obtener las valoraciones");
      }
    });
  }
}
