import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from 'src/app/Entities/restaurante';
import { Router } from '@angular/router';
import { DomSanitizer, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';
import { Plato } from 'src/app/Entities/plato';
import * as fs from 'fs';
import * as path from 'path';
import { Pedido } from 'src/app/Entities/pedido';
import { LineaPlato } from 'src/app/Entities/lineaPlato';
import { Valoracion } from 'src/app/Entities/valoracion';
//import { converBase64ToImage } from 'convert-base64-to-image';


@Component({
  selector: 'app-gestion-restaurantes',
  templateUrl: './gestion-restaurantes.component.html',
  styleUrls: ['./gestion-restaurantes.component.css']
})
export class GestionRestaurantesComponent implements OnInit {
  public previsualizacion!: string;
  public loading!: boolean;
  public archivos: any = [];


  public restauranteSelect: string;

  private platoSelect: string;
  private idPlatoSelect: string;
  public platoFoto: string;

  //pedidos restaurantes
  pedidoSel: Pedido;
  listaPlatosPedidoSel: LineaPlato[] = [];
  pedidoSelTotal: string = "";

  //restaurantes
  avisoNombre: string = "";
  avisoRazon: string = "";
  avisoCategoria: string = "";
  avisoCIF: string = "";
  avisoDireccion: string = "";
  avisoEmail: string = "";
  avisoTelefono: string = "";
  URL: string = new Url().url;
  funciones: FuncionesService;
  listaRestaurantes: Restaurante[] = [];
  listaPedidosRes: Pedido[] = [];
  facturacion: string = "";
  //platos
  avisoNombreP: string = "";
  avisoPrecioP: string = "";
  avisoDescP: string = "";
  avisoFotoP: string = "";
  listaPlatos: Plato[] = [];

  //valoraciones
  listaValoracionesRes: Valoracion[] = [];

  constructor(private router: Router, private http: HttpClient, private sanitizer: DomSanitizer) {
    this.funciones = new FuncionesService();
    this.restauranteSelect = '';
    this.platoSelect = '';
    this.idPlatoSelect = '';
    this.platoFoto = '';
    this.pedidoSel = new Pedido(1, "", 0);
  }

  ngOnInit(): void {
    this.peticionGetHttp();
  }

  aceptarCambiosCrear() {
    var correoCampo = document.getElementById("emailRes") as HTMLInputElement;
    var categoriaCampo = document.getElementById("categoria") as HTMLInputElement;
    var direccionCampo = document.getElementById("direccionRes") as HTMLInputElement;
    var nombreCampo = document.getElementById("nombreRes") as HTMLInputElement;
    var CIFCampo = document.getElementById("CIFRes") as HTMLInputElement;
    var razon_socialCampo = document.getElementById("razonRes") as HTMLInputElement;
    var telefonoCampo = document.getElementById("telRes") as HTMLInputElement;

    var errorCampo = false;

    this.avisoEmail = this.funciones.comprobarVacio(correoCampo?.value);
    if (this.avisoEmail !== "") { errorCampo = true; }
    this.avisoTelefono = this.funciones.comprobarVacio(telefonoCampo?.value);
    if (this.avisoTelefono !== "") { errorCampo = true; }
    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoDireccion = this.funciones.comprobarVacio(direccionCampo?.value);
    if (this.avisoDireccion !== "") { errorCampo = true; }
    this.avisoRazon = this.funciones.comprobarVacio(razon_socialCampo?.value);
    if (this.avisoRazon !== "") { errorCampo = true; }
    this.avisoCIF = this.funciones.comprobarVacio(CIFCampo?.value);
    if (this.avisoCIF !== "") { errorCampo = true; }
    this.avisoCategoria = this.funciones.comprobarVacio(categoriaCampo?.value);
    if (this.avisoCategoria !== "") { errorCampo = true; }

    if (!this.funciones.validarEmail(correoCampo?.value)) {
      this.avisoEmail = "Formato incorrecto";
      errorCampo = true;
    }

    if (this.funciones.esNumero(telefonoCampo?.value)) {
      this.avisoTelefono = "";
    } else {
      this.avisoTelefono = "Formato incorrecto";
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpCrear(nombreCampo?.value, categoriaCampo?.value,
        razon_socialCampo?.value, 0, direccionCampo?.value, correoCampo?.value,
        Number(telefonoCampo?.value), CIFCampo?.value);
    }

  }

  aceptarCambiosActualizar() {
    var correoCampo = document.getElementById("emailRes") as HTMLInputElement;
    var categoriaCampo = document.getElementById("categoria") as HTMLInputElement;
    var direccionCampo = document.getElementById("direccionRes") as HTMLInputElement;
    var nombreCampo = document.getElementById("nombreRes") as HTMLInputElement;
    var CIFCampo = document.getElementById("CIFRes") as HTMLInputElement;
    var razon_socialCampo = document.getElementById("razonRes") as HTMLInputElement;
    var telefonoCampo = document.getElementById("telRes") as HTMLInputElement;
    var valoracionCampo = document.getElementById("valoracionRes") as HTMLInputElement;

    var errorCampo = false;

    this.avisoEmail = this.funciones.comprobarVacio(correoCampo?.value);
    if (this.avisoEmail !== "") { errorCampo = true; }
    this.avisoTelefono = this.funciones.comprobarVacio(telefonoCampo?.value);
    if (this.avisoTelefono !== "") { errorCampo = true; }
    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoDireccion = this.funciones.comprobarVacio(direccionCampo?.value);
    if (this.avisoDireccion !== "") { errorCampo = true; }
    this.avisoRazon = this.funciones.comprobarVacio(razon_socialCampo?.value);
    if (this.avisoRazon !== "") { errorCampo = true; }
    this.avisoCIF = this.funciones.comprobarVacio(CIFCampo?.value);
    if (this.avisoCIF !== "") { errorCampo = true; }
    this.avisoCategoria = this.funciones.comprobarVacio(categoriaCampo?.value);
    if (this.avisoCategoria !== "") { errorCampo = true; }

    if (!this.funciones.validarEmail(correoCampo?.value)) {
      errorCampo = true;
    }

    if (this.funciones.esNumero(telefonoCampo?.value)) {
      this.avisoTelefono = "";
    } else {
      this.avisoTelefono = "Formato incorrecto";
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpActualizar(nombreCampo?.value, categoriaCampo?.value,
        razon_socialCampo?.value, valoracionCampo?.value, direccionCampo?.value,
        correoCampo?.value, Number(telefonoCampo?.value), CIFCampo?.value);
    }
  }

  peticionHttpCrear(nombre: string, categoria: string, razon_social: string, valoracion: GLfloat,
    direccion: string, correo: string, telefono: number, CIF: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "email": correo,
      "categoria": categoria,
      "razonSocial": razon_social,
      "valoracion": String(valoracion),
      "direccion": direccion,
      "nombre": nombre,
      "telefono": String(telefono),
      "cif": CIF,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/crearRestaurante';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Ya existe un restaurante con ese nombre")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Restaurante creado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_res", false);
          this.funciones.ocultarBtn("cont_confirm_add", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaRestaurantes');
        }
      }, error: error => {
        alert("Ha ocurrido un error al introducir el restaurante");
      }
    });

  }

  peticionHttpActualizar(nombre: string, categoria: string, razon_social: string,
    valoracion: string, direccion: string, correo: string, telefono: number,
    CIF: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "email": correo,
      "categoria": categoria,
      "razonSocial": razon_social,
      "valoracion": valoracion,
      "direccion": direccion,
      "nombre": nombre,
      "telefono": String(telefono),
      "cif": CIF,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/actualizarRestaurante';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No existe un restaurante con ese nombre")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Restaurante actualizado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_res", false);
          this.funciones.ocultarBtn("cont_confirm_udt", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaRestaurantes');
        }
      }, error: error => {
        alert("Ha ocurrido un error al actualizar el restaurante");
      }
    });

  }

  peticionGetHttp(): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const url = this.URL + 'food/consultarRestaurantes';
    this.http.get(url, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaRestaurantes = [];
        if (data.length == 0) {
          //alert(window.sessionStorage.getItem('rol'));
          //alert("No hay restaurantes");
        } else {
          var listaResJSON = data.split(";");
          for (let i = 0; i < listaResJSON.length; i++) {
            //console.log(listaResJSON[i]);
            this.listaRestaurantes.push(new Restaurante(listaResJSON[i], i))
            console.log(this.listaRestaurantes[i]);
          }
        }
      }, error: error => {
        //this.router.navigate(['/login']);
        alert("Ha ocurrido un error al cargar los restaurantes");
      }
    });
  }

  cancelarCambiosCrear() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_res', false); //mostrar btn_add

    this.funciones.ocultarBtn('btn_datos', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_carta', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_facturas', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_pedidos', false); //ocultar btns_carta_datos

    this.funciones.ocultarBtn('cont_confirm_add', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaRestaurantes');
  }

  cancelarCambiosActualizar() {
    this.disabledTodos(true); //bloquear campos
    this.dejarVacio();
    this.funciones.ocultarBtn('add_res', false); //mostrar btn_add

    this.funciones.ocultarBtn('btn_datos', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_carta', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_facturas', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_pedidos', false); //ocultar btns_carta_datos

    this.funciones.ocultarBtn('cont_confirm_udt', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaRestaurantes');
  }

  activarCamposCrear() {
    this.disabledTodos(false); //habilitar campos
    this.vaciarCampos(); //vaciar campos
    this.funciones.ocultarBtn('add_res', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_res', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_res', true); //ocultar btn_add

    this.funciones.ocultarBtn('btn_datos', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_carta', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_facturas', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_pedidos', true); //ocultar btns_carta_datos

    this.funciones.ocultarBtn('cont_confirm_add', false); //mostrar btns_aceptar_cancelar    
  }

  activarCamposActualizar() {
    this.disabledTodos(false); //habilitar campos
    this.funciones.disabledID('nombreRes', true);
    this.vaciarAvisos(); //vaciar campos
    this.funciones.ocultarBtn('add_res', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_res', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_res', true); //ocultar btn_add

    this.funciones.ocultarBtn('btn_datos', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_carta', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_facturas', true); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_pedidos', true); //ocultar btns_carta_datos

    this.funciones.ocultarBtn('cont_confirm_udt', false); //mostrar btns_aceptar_cancelar
  }

  eliminar() {
    var nombreCampo = document.getElementById("nombreRes") as HTMLInputElement;

    if (confirm("¿Seguro que quiere eliminar el restaurante?")) {
      this.peticionHttpEliminar(nombreCampo?.value);
      this.dejarVacio();
      this.peticionGetHttp();
      this.funciones.apagarElementosLista('listaRestaurantes');
    } else {
      //cancelar
    }
  }

  peticionHttpEliminar(nombre: string) {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "nombre": nombre,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/eliminarRestaurante';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No existe un restaurante llamado ")) {
          alert("No existe ese restaurante en la base de datos");
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Restaurante eliminado exitosamente");
          this.dejarVacio();
          this.funciones.ocultarBtn("add_res", false);
          this.funciones.ocultarBtn("cont_confirm_add", true);
          this.peticionGetHttp();
          this.funciones.apagarElementosLista('listaRestaurantes');
        }
      }, error: error => {
        alert("Ha ocurrido un error al eliminar el restaurante");
      }
    });
  }

  vaciarPedidos() {
    this.pedidoSel = new Pedido(1, "", 0);
    this.listaPlatosPedidoSel = [];
    this.pedidoSelTotal = "";
  }

  peticionHttpGetPedidos() {
    this.vaciarPedidos();
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password'),
      "restaurante": this.restauranteSelect
    };

    const url = this.URL + 'pedido/consultarPedidosRes/' + this.restauranteSelect;
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaPedidosRes = [];
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);

        } else if (data.includes("No hay pedidos")) {
          alert(data);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ese restaurante")) {
          alert(data);
        } else {
          var listaPedJSON = data.split(";;;");
          for (let i = 0; i < listaPedJSON.length; i++) {
            //console.log(listaResJSON[i]);
            let pedido = new Pedido(0, listaPedJSON[i], i);
            this.listaPedidosRes.push(pedido);
            console.log(this.listaPedidosRes[i]);

          }
        };

      }, error: error => {
        alert("Ha ocurrido un error al obtener los pedidos");
      }
    });
  }

  peticionHttpGetFacturacion(fechaInicio: string, fechaFin: string) {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password'),
      "restaurante": this.restauranteSelect,
      "fechaInicio": fechaInicio,
      "fechaFinal": fechaFin
    };

    const url = this.URL + 'pedido/consultarFacturacion';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaPedidosRes = [];
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);

        } else if (data.includes("El restaurante no tiene pedidos")) {
          alert(data);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No hay pedidos entre esas fechas")) {
          alert(data);
        } else {

          this.facturacion = Number(data).toFixed(2);
          console.log(this.facturacion);

        };

      }, error: error => {
        //alert("Ha ocurrido un error al obtener la facturacion");
        alert(error.message);
      }
    });
  }

  consultarFact() {
    var fechaInicio = document.getElementById("fechaIni") as HTMLInputElement;
    var fechaFin = document.getElementById("fechaFin") as HTMLInputElement;

    if (this.funciones.esFechaValida(fechaInicio?.value) && this.funciones.esFechaValida(fechaFin?.value)) {

      this.peticionHttpGetFacturacion(fechaInicio?.value, fechaFin?.value);

    } else {
      alert("Ingrese una fecha valida con el formato aaaa-mm-dd");
    }
  }

  mostrar_pedidos() {
    if (this.restauranteSelect !== "") {
      this.ocultarTodo()
      this.funciones.ocultarBtn("pedidos_v", false);
      this.peticionHttpGetPedidos();

      this.funciones.disabledID('add_res', true);
      this.funciones.disabledID('update_res', true);
      this.funciones.disabledID('delete_res', true);
    } else {
      alert("Selecciona un restaurante");
    }

  }

  mostrar_datos() {
    this.ocultarTodo()
    this.funciones.ocultarBtn("datos_v", false);

    this.funciones.disabledID('add_res', false);
    this.funciones.disabledID('update_res', false);
    this.funciones.disabledID('delete_res', false);
  }

  mostrar_carta() {
    if (this.restauranteSelect !== "") {
      this.ocultarTodo();
      this.dejarVacioCarta();
      this.funciones.ocultarBtn("carta_v", false);
      this.peticionGetHttpCarta();

      this.funciones.ocultarBtn("update_plato",true);
      this.funciones.ocultarBtn("delete_plato",true);
      

      this.funciones.disabledID('add_res', true);
      this.funciones.disabledID('update_res', true);
      this.funciones.disabledID('delete_res', true);
    } else {
      alert("Selecciona un restaurante");
    }
  }

  mostrar_facturas() {
    if (this.restauranteSelect !== "") {
      this.ocultarTodo()
      this.funciones.ocultarBtn("facturas_v", false);

      this.funciones.disabledID('add_res', true);
      this.funciones.disabledID('update_res', true);
      this.funciones.disabledID('delete_res', true);
    } else {
      alert("Selecciona un restaurante");
    }

  }

  ocultarTodo() {
    this.funciones.ocultarBtn("datos_v", true);
    this.funciones.ocultarBtn("carta_v", true);
    this.funciones.ocultarBtn("facturas_v", true);
    this.funciones.ocultarBtn("pedidos_v", true);
  }

  onSelect(element: Restaurante) {
    this.disabledTodos(true);
    console.log(element);
    this.restauranteSelect = element.nombre;
    this.cerrarVentanaValoracionesRes();

    this.funciones.apagarElementosLista('listaRestaurantes');
    this.funciones.resaltarElementoLista('listaRestaurantes', element.pos);

    this.funciones.asignarValorID('emailRes', element.correo);
    this.funciones.asignarValorID('categoria', element.categoria);
    this.funciones.asignarValorID('direccionRes', element.direccion);
    this.funciones.asignarValorID('nombreRes', element.nombre);
    this.funciones.asignarValorID('CIFRes', element.CIF);
    this.funciones.asignarValorID('razonRes', element.razon_social);
    this.funciones.asignarValorID('telRes', String(element.telefono));
    this.peticionGetHttpValoracionResMedia();
    //this.funciones.asignarValorID('valoracionRes', String(this.peticionGetHttpValoracionRes()));
    //this.funciones.asignarValorID('valoracionRes', String(element.valoracion));
    this.funciones.ocultarBtn("cont_confirm_add", true);
    this.funciones.ocultarBtn("cont_confirm_udt", true);
    this.funciones.ocultarBtn("add_res", false);
    this.funciones.ocultarBtn("update_res", false);
    this.funciones.ocultarBtn("delete_res", false);

    this.funciones.ocultarBtn('btn_datos', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_carta', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_facturas', false); //ocultar btns_carta_datos
    this.funciones.ocultarBtn('btn_pedidos', false); //ocultar btns_carta_datos
    this.mostrar_datos();
  }

  disabledTodos(valor: boolean) {
    this.funciones.disabledID('emailRes', valor);
    this.funciones.disabledID('categoria', valor);
    this.funciones.disabledID('direccionRes', valor);
    this.funciones.disabledID('nombreRes', valor);
    this.funciones.disabledID('CIFRes', valor);
    this.funciones.disabledID('razonRes', valor);
    this.funciones.disabledID('telRes', valor);
  }

  vaciarCampos() {
    this.funciones.asignarValorID("emailRes", "");
    this.funciones.asignarValorID("categoria", "");
    this.funciones.asignarValorID("direccionRes", "");
    this.funciones.asignarValorID("nombreRes", "");
    this.funciones.asignarValorID("CIFRes", "");
    this.funciones.asignarValorID("razonRes", "");
    this.funciones.asignarValorID("telRes", "");
    this.funciones.asignarValorID("valoracionRes", "0");
  }

  vaciarAvisos() {
    this.avisoNombre = "";
    this.avisoRazon = "";
    this.avisoCategoria = "";
    this.avisoCIF = "";
    this.avisoDireccion = "";
    this.avisoEmail = "";
    this.avisoTelefono = "";
  }

  dejarVacio() {
    this.vaciarAvisos();
    this.vaciarCampos();
    this.restauranteSelect = '';
  }

  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  /*-------------------------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------------------------*/
  /*------------------------------------CARTAS DESDE AQUI--------------------------------------*/
  /*-------------------------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------------------------*/
  vaciarCamposCarta() {
    this.funciones.asignarValorID("nombreP", "");
    this.funciones.asignarValorID("precio", "");
    this.funciones.asignarValorID("desc", "");
    this.funciones.seleccionarRadio("vegano", false);
    this.platoFoto = "";
  }

  vaciarAvisosCarta() {
    this.avisoNombreP = "";
    this.avisoPrecioP = "";
    this.avisoDescP = "";
    this.avisoFotoP = "";
  }

  dejarVacioCarta() {
    this.vaciarAvisosCarta();
    this.vaciarCamposCarta();
    this.platoSelect = "";
  }

  aceptarCambiosCrearCarta() {
    if (this.restauranteSelect == "") {
      alert("Selecciona un restaurante");
      return;
    }

    var nombrePCampo = document.getElementById("nombreP") as HTMLInputElement;
    var precioPCampo = document.getElementById("precio") as HTMLInputElement;
    var descripcionPCampo = document.getElementById("desc") as HTMLInputElement;
    var veganoPCampo = document.getElementById("vegano") as HTMLInputElement;
    var fotoPCampo = document.getElementById("foto") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombreP = this.funciones.comprobarVacio(nombrePCampo?.value);
    if (this.avisoNombreP !== "") { errorCampo = true; }
    this.avisoDescP = this.funciones.comprobarVacio(descripcionPCampo?.value);
    if (this.avisoDescP !== "") { errorCampo = true; }

    let aux = String(Number(precioPCampo?.value).toFixed(2));
    console.log(aux);

    if (aux === '') {
      errorCampo = true;
      this.avisoPrecioP = "Campo vacío";
    } else if (aux === 'NaN') {
      errorCampo = true;
      this.avisoPrecioP = "Formato incorrecto";
    } else {
      precioPCampo.value = String(Number(precioPCampo?.value).toFixed(2));
      this.avisoPrecioP = "";
    }

    if (!errorCampo) {
      this.peticionHttpCrearCarta(nombrePCampo?.value, Number(precioPCampo?.value),
        descripcionPCampo?.value, veganoPCampo.checked, this.restauranteSelect);
    }
  }

  aceptarCambiosActualizarCarta() {
    if (this.restauranteSelect == "") {
      alert("Selecciona un restaurante");
      return
    }

    if (this.platoSelect == "") {
      alert("Selecciona un plato");
      return
    }

    var nombrePCampo = document.getElementById("nombreP") as HTMLInputElement;
    var precioPCampo = document.getElementById("precio") as HTMLInputElement;
    var descripcionPCampo = document.getElementById("desc") as HTMLInputElement;
    var veganoPCampo = document.getElementById("vegano") as HTMLInputElement;
    var fotoPCampo = document.getElementById("foto") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombreP = this.funciones.comprobarVacio(nombrePCampo?.value);
    if (this.avisoNombreP !== "") { errorCampo = true; }
    this.avisoDescP = this.funciones.comprobarVacio(descripcionPCampo?.value);
    if (this.avisoDescP !== "") { errorCampo = true; }

    let aux = String(parseFloat(precioPCampo?.value));
    console.log(Number(precioPCampo?.value));

    if (aux === '') {
      errorCampo = true;
      this.avisoPrecioP = "Campo vacío";
    } else if (aux === 'NaN') {
      errorCampo = true;
      this.avisoPrecioP = "Formato incorrecto";
    } else {
      precioPCampo.value = String(parseFloat(precioPCampo?.value));
      this.avisoPrecioP = "";
    }

    console.log(errorCampo);
    
    if (!errorCampo) {
      this.peticionHttpActualizarCarta(nombrePCampo?.value, this.platoSelect, Number(precioPCampo?.value),
        descripcionPCampo?.value, veganoPCampo.checked, this.restauranteSelect);
    }
  }

  eliminarCarta() {
    if (this.restauranteSelect == "") {
      alert("Selecciona un restaurante");
      return
    }
    if (this.platoSelect == "") {
      alert("Selecciona un plato");
      return
    }

    var nombrePCampo = document.getElementById("nombreP") as HTMLInputElement;

    if (confirm("¿Seguro que quiere eliminar el plato?")) {
      this.peticionHttpEliminarPlato(nombrePCampo?.value);
      this.dejarVacioCarta();
      this.funciones.apagarElementosLista('listaPlatos');
      this.peticionGetHttpCarta();
    } else {
      //cancelar
    }
  }

  peticionHttpCrearCarta(nombreP: string, precioP: number,
    descripcionP: string, veganoP: boolean, nombreRes: string) {

      let fotoP = this.guardarFotoPlato(nombreP, nombreRes, this.platoFoto);
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "nombre": nombreP,
      "aptoVegano": String(veganoP),
      "descripcion": descripcionP,
      "precio": String(precioP),
      "foto": fotoP,
      "nombreRestaurante": nombreRes,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/crearPlato';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Ya existe un plato con ese nombre")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Plato creado exitosamente");
          this.dejarVacioCarta();
          this.funciones.ocultarBtn("add_plato", false);
          this.funciones.ocultarBtn("cont_confirm_addP", true);
          this.peticionGetHttpCarta();
          this.funciones.apagarElementosLista('listaPlatos');
        }
      }, error: error => {
        alert("Ha ocurrido un error al introducir el restaurante");
        //alert(error.error);
      }
    });
  }

  peticionHttpActualizarCarta(nombreP: string, nombreViejo: string, precioP: number, descripcionP: string, veganoP: boolean, nombreRes: string): void {
    //console.log("aqui pasa");
    let fotoP = this.guardarFotoPlato(nombreP, nombreRes, this.platoFoto);
    
    
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "idPlato": this.idPlatoSelect,
      "nombre": nombreP,
      "nombreViejo": nombreViejo,
      "aptoVegano": String(veganoP),
      "descripcion": descripcionP,
      "precio": String(precioP),
      "foto": fotoP,
      "nombreRestaurante": nombreRes,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/actualizarPlato';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("Ya existe un plato con ese nombre")) {
          alert(data);
        } else if (data.includes("No existe un plato con ese nombre")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Plato actualizado exitosamente");
          this.dejarVacioCarta();
          this.funciones.ocultarBtn("add_plato", false);
          this.funciones.ocultarBtn("cont_confirm_udtP", true);
          this.peticionGetHttpCarta();
          this.funciones.apagarElementosLista('listaPlatos');
        }
      }, error: error => {
        //alert("Ha ocurrido un error al actualizar el restaurante");
        alert(error.error);
      }
    });

  }

  peticionHttpEliminarPlato(nombrePlato: string) {
    if (this.restauranteSelect == "") {
      alert("Selecciona un restaurante");
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "idPlato": this.idPlatoSelect,
      "nombrePlato": nombrePlato,
      "nombreRes": this.restauranteSelect,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'food/eliminarPlato';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No existe ese plato")) {
          alert(data);
        } else if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else {
          alert("Plato eliminado exitosamente");
          this.dejarVacioCarta();
          this.funciones.ocultarBtn("add_plato", false);
          this.funciones.ocultarBtn("cont_confirm_addP", true);
          this.peticionGetHttpCarta();
          this.funciones.apagarElementosLista('listaPlatos');
        }
      }, error: error => {
        alert("Ha ocurrido un error al eliminar el restaurante");
      }
    });
  }

  peticionGetHttpCarta(): void {
    if (this.restauranteSelect !== "") {
      const headers = {
        'Content-Type': 'application/json'
      };

      const url = this.URL + 'food/getCarta/' + this.restauranteSelect;
      this.http.get(url, { headers, responseType: 'text' }).subscribe({
        next: data => {
          //console.log(data);

          this.listaPlatos = [];
          if (data.length == 0) {
            //alert(window.sessionStorage.getItem('rol'));
            alert("No hay carta en ese restaurante");
            this.platoFoto = "";
          } else {
            var listaCartaJSON = data.split(";;");
            for (let i = 0; i < listaCartaJSON.length; i++) {
              //console.log(listaResJSON[i]);
              this.listaPlatos.push(new Plato(listaCartaJSON[i], i))
              console.log(this.listaPlatos[i]);
            }
          }
        }, error: error => {
          alert("Ha ocurrido un error al cargar la carta del restaurante");
        }
      });
    } else {
      alert("Selecciona un restaurante");
    }
  }

  onSelectP(element: Plato) {
    this.disabledTodosP(true);
    console.log(element);

    this.funciones.apagarElementosLista('listaPlatos');
    this.funciones.resaltarElementoLista('listaPlatos', element.pos);

    this.funciones.asignarValorID('nombreP', element.nombreP);
    this.funciones.asignarValorID('precio', String(element.precioP));
    this.funciones.seleccionarRadio('vegano', element.veganoP);
    this.funciones.asignarValorID('desc', element.descripcionP);

    var fotoCampo = document.getElementById("fotoPlato") as HTMLImageElement;
    fotoCampo.src = element.fotoP;

    this.funciones.ocultarBtn("cont_confirm_addP", true);
    this.funciones.ocultarBtn("cont_confirm_udtP", true);
    this.funciones.ocultarBtn("add_plato", false);
    this.funciones.ocultarBtn("update_plato", false);
    this.funciones.ocultarBtn("delete_plato", false);
    this.platoSelect = element.nombreP;
    this.idPlatoSelect = element.id;
  }

  onSelectPed(element: Pedido) {
    this.pedidoSel = element;
    this.funciones.apagarElementosLista('listaPedidos');
    this.funciones.resaltarElementoLista('listaPedidos', element.pos);

    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, this.restauranteSelect);
    this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);

    if (element.estado == 0) {
      this.funciones.asignarValorID('estadoPed', "En preparación");
    } else if (element.estado == 1) {
      this.funciones.asignarValorID('estadoPed', "En reparto");
    } else if (element.estado == 2) {
      this.funciones.asignarValorID('estadoPed', "Entregado");
    } else {
      this.funciones.asignarValorID('estadoPed', "Desconocido");
    }

    this.funciones.asignarValorID('riderPed', element.rider);
  }

  disabledTodosP(valor: boolean) {
    this.funciones.disabledID('nombreP', valor);
    this.funciones.disabledID('precio', valor);
    this.funciones.disabledID('vegano', valor);
    this.funciones.disabledID('desc', valor);
    this.funciones.disabledID('botonFoto', valor);
  }

  cancelarCambiosCrearP() {
    this.disabledTodosP(true); //bloquear campos
    this.dejarVacioCarta();
    this.funciones.ocultarBtn('add_plato', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_addP', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaPlatos');
  }

  cancelarCambiosActualizarP() {
    this.disabledTodosP(true); //bloquear campos
    this.dejarVacioCarta();
    this.funciones.ocultarBtn('add_plato', false); //mostrar btn_add
    this.funciones.ocultarBtn('cont_confirm_udtP', true); //ocultar btns_aceptar_cancelar
    this.funciones.apagarElementosLista('listaPlatos');
  }

  activarCamposCrearP() {
    this.disabledTodosP(false); //habilitar campos
    this.vaciarCamposCarta(); //vaciar campos
    this.funciones.ocultarBtn('add_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_addP', false); //mostrar btns_aceptar_cancelar    
  }

  activarCamposActualizarP() {
    this.disabledTodosP(false); //habilitar campos
    this.vaciarAvisosCarta(); //vaciar campos
    this.funciones.ocultarBtn('add_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('update_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('delete_plato', true); //ocultar btn_add
    this.funciones.ocultarBtn('cont_confirm_udtP', false); //mostrar btns_aceptar_cancelar
  }

  capturarFile(event: any) {
    let file = event.target.files[0];
    this.imageConverter(file);
  }

  imageConverter(file: Blob) {
    let self = this;
    let reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        self.platoFoto = ("data:image/png;base64," + btoa(reader.result));
      }
    }
    reader.readAsBinaryString(file);
  }

  guardarFotoPlato(plato: string, restaurante: string, fotoBase64: string): string {
    if (fotoBase64 == "") {
      return '../../../assets/plt_images/food.png';
    }
    return fotoBase64;
    //let pathToSaveImage = '../../../assets/plt_images/' + restaurante + '-' + plato + '.png';
    /*let pathGuardado;
    try {
      pathGuardado = converBase64ToImage(fotoBase64, pathToSaveImage);
    } catch (error) {
      console.log(error);
      pathGuardado = '../../../assets/plt_images/food.png';
    }*/
    /*try {
      fs.writeFile(pathToSaveImage, fotoBase64, 'base64', function (err:any) {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }

    //console.log(pathGuardado);
    console.log(pathToSaveImage);
    return pathToSaveImage;*/
  }

  mostrarValoracionesRes() {
    if (this.restauranteSelect != "") {
      this.peticionHttpGetValoracionesDetalladas();
      this.listaValoracionesRes = [];
      this.funciones.ocultarBtn('contenedor_valoracionesRes', false);
    } else {
      alert("Selecciona un restaurante");
    }
  }

  cerrarVentanaValoracionesRes() {
    this.funciones.ocultarBtn('contenedor_valoracionesRes', true);
  }

  peticionGetHttpValoracionRes(): Number {
    if (this.restauranteSelect !== "") {
      const headers = {
        'Content-Type': 'application/json'
      };
      const body = {
        "restaurante": this.restauranteSelect,
        "correoAcceso": window.sessionStorage.getItem('correo'),
        "passwordAcceso": window.sessionStorage.getItem('password')
      };

      const url = this.URL + 'pedido/consultarValoracionRestauranteMedia';
      this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
        next: data => {
          console.log("DATOS:")
          console.log(data);

          if (data.includes("El restaurante no tiene valoraciones")) {
            //alert(window.sessionStorage.getItem('rol'));
            return 0;
          } else {
            return Number(data).toFixed(1);
          }
        }, error: error => {
          //alert("Ha ocurrido un error al cargar la valoración del restaurante");
          console.log("ERROR:");
          console.log(error.message);
          return 0
        }
      });


    } else {
      alert("Selecciona un restaurante");

    }
    return 0
  }

  peticionGetHttpValoracionResMedia(): void {
    if (this.restauranteSelect !== "") {
      const headers = {
        'Content-Type': 'application/json'
      };

      const url = this.URL + 'pedido/consultarMedia/' + this.restauranteSelect;
      this.http.get(url, { headers, responseType: 'text' }).subscribe({
        next: data => {
          console.log("DATOS:")
          console.log(data);

          if (data.includes("El restaurante no tiene valoraciones")) {
            this.funciones.asignarValorID('valoracionRes', "0.0");
            //alert(data); 
          } else {
            this.funciones.asignarValorID('valoracionRes', String(Number(data).toFixed(1)));
          }
        }, error: error => {
          alert("Ha ocurrido un error al cargar la valoración del restaurante");
          console.log("ERROR:");
          console.log(error.message);
        }
      });
    } else {
      alert("Selecciona un restaurante");
    }
  }

  peticionHttpGetValoracionesDetalladas() {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "restaurante": this.restauranteSelect,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarValoracionRestaurante';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaValoracionesRes = [];
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);

        } else if (data.includes(this.restauranteSelect + " no tiene valoraciones")) {
          this.funciones.ocultarBtn('contenedor_valoracionesRes', true);
          alert(data + " detalladas");
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ese restaurante")) {
          alert(data);
        } else {
          var listaValJSON = data.split(";;;");
          for (let i = 0; i < listaValJSON.length; i++) {
            let valoracion = new Valoracion(listaValJSON[i], i);
            this.listaValoracionesRes.push(valoracion);
            console.log(this.listaValoracionesRes[i]);

          }
        };

      }, error: error => {
        alert("Ha ocurrido un error al obtener las valoraciones");
      }
    });
  }
}
