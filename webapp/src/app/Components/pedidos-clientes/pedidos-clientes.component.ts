import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/Entities/cliente';
import { LineaPlato } from 'src/app/Entities/lineaPlato';
import { Pedido } from 'src/app/Entities/pedido';
import { Plato } from 'src/app/Entities/plato';
import { Restaurante } from 'src/app/Entities/restaurante';
import { Url } from 'src/app/Entities/url';
import { Valoracion } from 'src/app/Entities/valoracion';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-pedidos-clientes',
  templateUrl: './pedidos-clientes.component.html',
  styleUrls: ['./pedidos-clientes.component.css']
})
export class PedidosClientesComponent implements OnInit {

  avisoNombre: string = "";
  avisoApellidos: string = "";
  avisoTel: string = "";
  avisoPwd: string = "";
  avisoDireccion: string = "";

  funciones: FuncionesService;
  URL: string = new Url().url;

  listaRestaurantes: Restaurante[] = [];
  listaPlatos: Plato[] = [];
  listaPlatosPedidoSel: LineaPlato[] = [];
  listaPedidosPendientes: Pedido[] = [];
  listaPedidosEntregados: Pedido[] = [];
  listaPedidosEnProgreso: Pedido[] = [];
  pedidoSel: Pedido;
  restauranteSel: string = '';
  rankSel: string = '';
  pedidoSelTotal: string = "";

  valorRes: number = 0;
  valorRid: number = 0;

  //valoraciones
  listaValoracionesRes: Valoracion[] = [];


  constructor(private router: Router, private http: HttpClient) {
    this.pedidoSel = new Pedido(1, "", 0);
    this.funciones = new FuncionesService();
  }

  ngOnInit(): void {
    this.peticionGetHttp();
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
            var rest = new Restaurante(listaResJSON[i], i);
            this.listaRestaurantes.push(rest)
            console.log(this.listaRestaurantes[i]);
          }
          this.asignarValoracion();
        }
      }, error: error => {
        //this.router.navigate(['/login']);
        alert("Ha ocurrido un error al cargar los restaurantes");
      }
    });
  }

  peticionGetHttpCarta(): void {
    if (this.restauranteSel !== "") {
      const headers = {
        'Content-Type': 'application/json'
      };

      const url = this.URL + 'food/getCarta/' + this.restauranteSel;
      this.http.get(url, { headers, responseType: 'text' }).subscribe({
        next: data => {
          //console.log(data);

          this.listaPlatos = [];
          if (data.length == 0) {
            //alert(window.sessionStorage.getItem('rol'));
            alert("No hay carta en ese restaurante");
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

  peticionGetHttpPedidosCli(): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarPedidosCliente';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log(data);
        this.listaPedidosEnProgreso = [];
        this.listaPedidosEntregados = [];

        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No hay pedidos")) {
          alert(data);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else {
          var listaPedJSON = data.split(";;;");
          let posProg = 0;
          let posEnt = 0;
          for (let i = 0; i < listaPedJSON.length; i++) {
            //console.log(listaResJSON[i]);
            let pedido = new Pedido(0, listaPedJSON[i], 0);
            if (pedido.estado == 2) {
              pedido.pos = posEnt;
              posEnt++;
              this.listaPedidosEntregados.push(pedido);
            } else {
              pedido.pos = posProg;
              posProg++;
              this.listaPedidosEnProgreso.push(pedido);
            }
          }
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar los pedidos del cliente");
        //alert(error.message);
      }
    });
  }

  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  onSelectRes(element: Restaurante) {
    this.restauranteSel = element.nombre;
    this.funciones.apagarElementosLista('listaRestaurantesPedCli');
    this.funciones.resaltarElementoLista('listaRestaurantesPedCli', element.pos);

    this.peticionGetHttpCarta();
  }

  onSelectPlt(element: Plato) {

  }

  onSelectPedEnt(element: Pedido) {
    console.log(element);
    this.pedidoSel = element;
    this.funciones.ocultarBtn('btn_cancelarPed', true);

    this.funciones.apagarElementosLista('listaPedidosEntregados');
    this.funciones.apagarElementosLista('listaPedidosEnProgreso');
    this.funciones.resaltarElementoLista('listaPedidosEntregados', element.pos);

    this.listaPlatosPedidoSel = [];
    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, this.restauranteSel);
    this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);
  }

  onSelectPedProg(element: Pedido) {
    this.listaPlatosPedidoSel = [];
    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, element.restaurante);
    this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);
    

    this.pedidoSel = element;
    console.log(element);
    console.log(this.listaPlatosPedidoSel);

    this.funciones.ocultarBtn('btn_cancelarPed', false);

    
    this.funciones.apagarElementosLista('listaPedidosEnProgreso');
    this.funciones.apagarElementosLista('listaPedidosEntregados');
    this.funciones.resaltarElementoLista('listaPedidosEnProgreso', element.pos);

    // console.log(element);
    // this.pedidoSel = element;
    // this.funciones.ocultarBtn('btn_cancelarPed', false);

    // this.funciones.apagarElementosLista('listaPedidosEnProgreso');
    // this.funciones.apagarElementosLista('listaPedidosEntregados');
    // this.funciones.resaltarElementoLista('listaPedidosEnProgreso', element.pos);

    // this.listaPlatosPedidoSel = [];
    // this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, this.restauranteSel);
    // this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);
  }

  onSelectPedPend(element: Pedido) {
    this.listaPlatosPedidoSel = [];
    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, element.restaurante);
    this.pedidoSel = element;
    console.log(element);
    console.log(this.listaPlatosPedidoSel);
    
    this.funciones.apagarElementosLista('listaPedidosPendientes');
    this.funciones.resaltarElementoLista('listaPedidosPendientes', element.pos);
  }

  ocultarTodo() {
    this.funciones.ocultarBtn("contenedor_pedir", true);
    this.funciones.ocultarBtn("contenedor_carrito", true);
    this.funciones.ocultarBtn("contenedor_pedidos", true);
    this.funciones.ocultarBtn("contenedor_usuario", true);
    this.funciones.ocultarBtn("contenedor_valorarPed", true);
    this.funciones.ocultarBtn("contenedor_valoracionesRes", true);
  }

  mostrar_pedidos() {
    this.ocultarTodo()
    this.funciones.ocultarBtn("contenedor_pedidos", false);
    this.peticionGetHttpPedidosCli();
  }

  mostrar_platos() {
    this.ocultarTodo()
    this.funciones.ocultarBtn("contenedor_pedir", false);
    this.restauranteSel = "";
    this.listaPlatos = [];
    this.funciones.apagarElementosLista('listaRestaurantesPedCli');
  }

  mostrar_carrito() {
    this.ocultarTodo()
    this.listaPlatosPedidoSel = [];
    this.posicionesPedidos();
    this.pedidoSel = new Pedido(1, "", 0);
    this.funciones.apagarElementosLista('listaPedidosPendientes');
    this.funciones.ocultarBtn("contenedor_carrito", false);
  }

  posicionesPedidos() {
    for (let index = 0; index < this.listaPedidosPendientes.length; index++) {
      this.listaPedidosPendientes[index].pos = index;
    }
  }

  mostrar_valorar(element: Pedido) {
    this.funciones.ocultarBtn("contenedor_valorarPed", false);
    this.peticionGetHttpValoracionHecha(element, element.restaurante, 0);
    this.peticionGetHttpValoracionHecha(element, element.rider, 1);
    this.pedidoSel = element;
  }

  mostrar_valoraciones(element: Restaurante) {
    this.listaValoracionesRes = [];
    this.peticionHttpGetValoracionesDetalladas(element);
    this.funciones.ocultarBtn("contenedor_valoracionesRes", false);
  }

  mostrar_datosUsuario() {
    this.ocultarTodo();
    this.funciones.ocultarBtn("contenedor_usuario", false);
    this.peticionGetHttpDatosUsuario();
  }

  enviarCarrito(element: Plato) {
    var pedidoAux = this.funciones.getPedidoDelRestaurante(this.listaPedidosPendientes, this.restauranteSel)
    //Si no existe el pedido lo creamos
    if (pedidoAux == null) {
      pedidoAux = new Pedido(1, "", 0);
      if (this.restauranteSel == "") {
        alert("Error al obtener el restaurante seleccionado");
        return
      } else {
        pedidoAux.restaurante = this.restauranteSel;
      }
      let linea = new LineaPlato(element.nombreP,
        String(element.precioP), String(1), this.restauranteSel);
      linea.foto = element.fotoP;
      console.log(linea);
      console.log(element);
      this.funciones.addLineaPlatoPedido(pedidoAux, linea);

      this.listaPedidosPendientes.push(pedidoAux);
    } else {
      if (this.restauranteSel == "") {
        alert("Error al obtener el restaurante seleccionado");
        return
      } else {
        let linea = new LineaPlato(element.nombreP,
          String(element.precioP), String(1), this.restauranteSel)
        linea.foto = element.fotoP;
        this.funciones.addLineaPlatoPedido(pedidoAux, linea);
      }
    }

    var imagenBoton = document.getElementById("carritoCli")!;
    if(this.listaPedidosPendientes.length > 0){
      
      imagenBoton.setAttribute("src", "../../../assets/ui_images/shopping-cart4.png");
    }else{
      imagenBoton.setAttribute("src", "../../../assets/ui_images/shopping-cart2.png");
    }
  }

  disminuirCantidadPlatoPed(element: LineaPlato) {
    console.log(this.listaPlatosPedidoSel);
    if (Number(element.cantidad) > 1) {
      element.cantidad = String(Number(element.cantidad) - 1);
    }
    this.pedidoSel.listaPlatos = this.funciones.lineasPlatosList(this.listaPlatosPedidoSel);
  }

  aumentarCantidadPlatoPed(element: LineaPlato) {
    if (Number(element.cantidad) < 100) {
      element.cantidad = String(Number(element.cantidad) + 1);
    }
    this.pedidoSel.listaPlatos = this.funciones.lineasPlatosList(this.listaPlatosPedidoSel);
  }

  peticionHttpCancelarPedidoEnCarrito(): void {
    if (!(this.pedidoSel.restaurante == "")) {
      //alert("Pedido cancelado");
      this.listaPedidosPendientes.splice(this.listaPedidosPendientes.indexOf(this.pedidoSel), 1);
      this.listaPlatosPedidoSel = [];
      this.pedidoSel = new Pedido(1, "", 0);
      //lo quito de la lista
      this.mostrar_carrito();
      var imagenBoton = document.getElementById("carritoCli")!;
      if(this.listaPedidosPendientes.length == 0){
        imagenBoton.setAttribute("src", "../../../assets/ui_images/shopping-cart2.png");
      }
    } else {
      alert("Selecciona un pedido");
    }
  }

  peticionHttpOrdenarPedidoEnCarrito(): void {
    if (!(this.pedidoSel.restaurante == "")) {
      this.peticionHttpCrearPedido(this.pedidoSel);
      this.mostrar_carrito();
    } else {
      alert("Selecciona un pedido");
    }
  }

  peticionHttpCrearPedido(pedido: Pedido): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "platos": pedido.listaPlatos,
      "restaurante": pedido.restaurante,
      "rider": "",
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/crearPedido/';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log(data);
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No hay pedidos")) {
          alert(data);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else {
          alert("Pedido creado correctamente");
          this.listaPedidosPendientes = this.quitarPed(pedido);
          this.listaPlatosPedidoSel = [];
          this.pedidoSel = new Pedido(1, "", 0);
          this.mostrar_carrito();
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar el pedido del cliente");
      }
    });
  }

  quitarPed(pedido: Pedido): Pedido[] {
    var listaAux : Pedido[] = [];
    for (let i = 0; i < this.listaPedidosPendientes.length; i++) {
      if (!(this.listaPedidosPendientes[i].restaurante == pedido.restaurante)) {
        listaAux.push(this.listaPedidosPendientes[i]);
      }
    }
    return listaAux;
  }

  peticionHttpCancelarPedidoEnPedidos(): void {
    if (!(this.pedidoSel.restaurante == "")) {
      //alert("Pedido cancelado");
      this.peticionHttpCancelarPedido(this.pedidoSel)
      this.pedidoSel = new Pedido(1, "", 0);
      this.listaPlatosPedidoSel = [];
      this.pedidoSelTotal = "";
      this.funciones.apagarElementosLista('listaPedidosEntregados');
      this.funciones.apagarElementosLista('listaPedidosEnProgreso');
    } else {
      alert("Selecciona un pedido");
    }
  }

  peticionHttpCancelarPedido(pedido: Pedido): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password'),
      "idPedido": pedido.id
    };

    const url = this.URL + 'pedido/cancelarPedido/' + pedido.id;
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log(data);
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else if (data.includes("Ya no puedes cancelar el pedido")) {
          alert(data);
        } else if (data.includes("No puedes cancelar el pedido, no es tuyo")) {
          alert(data);
        } else if (data.includes("No existe ese pedido")) {
          alert(data);
        } else {
          alert("Pedido cancelado correctamente");
          this.peticionGetHttpPedidosCli();
        }
      }, error: error => {
        alert("Ha ocurrido un error al cancelar el pedido del cliente");
      }
    });
  }

  asignarValoracion() {
    for (let i = 0; i < this.listaRestaurantes.length; i++) {
      this.peticionGetHttpValoracionResMedia(this.listaRestaurantes[i]);
    }
    console.log(this.listaRestaurantes);
  }

  peticionGetHttpValoracionResMedia(restaurante: Restaurante): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const url = this.URL + 'pedido/consultarMedia/' + restaurante.nombre;
    this.http.get(url, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("El restaurante no tiene valoraciones")) {
        } else {
          restaurante.valoracion = String(Number(data).toFixed(1));
        }
      }, error: error => {
        alert("Ha ocurrido un error al cargar la valoración del restaurante");
        console.log("ERROR:");
        console.log(error.message);
      }
    });
  }

  peticionHttpGetValoracionesDetalladas(restaurante: Restaurante): void {
    console.log("entro en peticionHttpGetValoracionesDetalladas");

    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "restaurante": restaurante.nombre,
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

        } else if (data.includes(restaurante.nombre + " no tiene valoraciones")) {
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
    console.log(this.listaValoracionesRes);
  }

  cerrarVentanaValoracionesRes() {
    this.funciones.ocultarBtn('contenedor_valoracionesRes', true);
  }

  cerrarVentanaValorar() {
    this.funciones.ocultarBtn('contenedor_valorarPed', true);
  }

  actualizarDatosCli() {
    this.funciones.ocultarBtn('btn_udp_datosCli', true);
    this.funciones.ocultarBtn('cont_confirm_udt_cli', false);
    this.disableCamposUpd(false);
  }

  aceptarCambiosActualizar() {
    this.validarActualizarDatosCli();
    this.funciones.ocultarBtn('btn_udp_datosCli', false);
    this.funciones.ocultarBtn('cont_confirm_udt_cli', true);
    this.disableCamposUpd(true);
    this.mostrar_datosUsuario();
  }

  cancelarCambiosActualizar() {
    this.funciones.ocultarBtn('btn_udp_datosCli', false);
    this.funciones.ocultarBtn('cont_confirm_udt_cli', true);
    this.disableCamposUpd(true);
    this.mostrar_datosUsuario();
  }

  disableCamposUpd(valor: boolean) {
    this.funciones.disabledID('nombreCli', valor);
    this.funciones.disabledID('apellidosCli', valor);
    this.funciones.disabledID('telCli', valor);
    this.funciones.disabledID('passwordCli', valor);
    this.funciones.disabledID('direccionCli', valor);
  }

  validarActualizarDatosCli() {
    var nombreCampo = document.getElementById("nombreCli") as HTMLInputElement;
    var apellidosCampo = document.getElementById("apellidosCli") as HTMLInputElement;
    var telCampo = document.getElementById("telCli") as HTMLInputElement;
    var pwdCampo = document.getElementById("passwordCli") as HTMLInputElement;
    var direccionCampo = document.getElementById("direccionCli") as HTMLInputElement;

    var errorCampo = false;

    this.avisoNombre = this.funciones.comprobarVacio(nombreCampo?.value);
    if (this.avisoNombre !== "") { errorCampo = true; }
    this.avisoApellidos = this.funciones.comprobarVacio(apellidosCampo?.value);
    if (this.avisoApellidos !== "") { errorCampo = true; }
    this.avisoTel = this.funciones.comprobarVacio(telCampo?.value);
    if (this.avisoTel !== "") { errorCampo = true; }
    this.avisoPwd = this.funciones.comprobarVacio(pwdCampo?.value);
    if (this.avisoPwd !== "") { errorCampo = true; }
    this.avisoDireccion = this.funciones.comprobarVacio(direccionCampo?.value);
    if (this.avisoDireccion !== "") { errorCampo = true; }

    if (this.funciones.esNumero(telCampo?.value)) {
      this.avisoTel = "";
    } else {
      this.avisoTel = "Formato incorrecto";
      errorCampo = true;
    }

    if (!errorCampo) {
      this.peticionHttpActualizarDatosCli(nombreCampo?.value, apellidosCampo?.value,
        telCampo?.value, pwdCampo?.value, direccionCampo?.value);
    }
  }

  peticionHttpActualizarDatosCli(nombre: string, apellidos: string,
    tel: string, pwd: string, direccion: string): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "pwd1": pwd,
      "pwd2": pwd,
      "apellidos": apellidos,
      "nombre": nombre,
      "telefono": tel,
      "direccion": direccion,
      "rol": "client",
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    console.log(body.correoAcceso);

    let url = this.URL + 'user/actualizarUsuarioCliente/'
    console.log(url);
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese cliente en la base de datos");
        } else if (data.includes("contraseña")) {
          alert(data);
        } else {
          alert("Cliente actualizado exitosamente");
          this.mostrar_datosUsuario();
        }
      }, error: error => {
        //alert("Ha ocurrido un error al actualizar el cliente");
        alert(error.error);
      }
    });
  }

  peticionGetHttpDatosUsuario(): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    let url = this.URL + 'user/consultarDatosCliente/'
    console.log(url);
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No existe ningun usuario en la base de datos")) {
          alert("No existe ese cliente en la base de datos");
        } else if (data.includes("contraseña ")) {
          alert(data);
        } else {
          this.cargarCamposUsuario(data);
        }
      }, error: error => {
        //alert("Ha ocurrido un error al actualizar el cliente");
        alert(error.error);
      }
    });
  }

  cargarCamposUsuario(data: string) {
    var user = new Cliente(data, 0);

    this.funciones.asignarValorID('nombreCli', user.nombre);
    this.funciones.asignarValorID('apellidosCli', user.apellidos);
    this.funciones.asignarValorID('telCli', String(user.telefono));
    this.funciones.asignarValorID('passwordCli', user.pwd);
    this.funciones.asignarValorID('direccionCli', user.direccion);
    this.funciones.asignarValorID('emailCli', user.correo);
    this.funciones.asignarValorID('nifCli', user.nif);
  }

  clickEstrella(lista: number, valor: number) {
    if (lista == 0) {
      this.funciones.cambiarFondoEstrella('cont_estrellas_res', valor);
      this.valorRes = valor;
    } else {
      this.funciones.cambiarFondoEstrella('cont_estrellas_rid', valor);
      this.valorRid = valor;
    }
  }

  //valorar
  enviarValRes(lista: number){
    var comentarioCampo;
    if(lista == 0){
      comentarioCampo = document.getElementById("comentario1") as HTMLInputElement;
      if(this.valorRes == 0){
        alert("Selecciona al menos una estrella");
      }else{
        this.peticionHttpPedidosCrearValRes(this.pedidoSel, this.pedidoSel.restaurante, 
          comentarioCampo?.value, this.valorRes);
        this.valorRes = 0;
      }
    }else{
      comentarioCampo = document.getElementById("comentario2") as HTMLInputElement;
      if(this.valorRid == 0){
        alert("Selecciona al menos una estrella");
      }else{
        this.peticionHttpPedidosCrearValRes(this.pedidoSel, this.pedidoSel.rider, 
          comentarioCampo?.value, this.valorRid);
        this.valorRid = 0;
      }
    }
  }


  peticionHttpPedidosCrearValRes(pedido: Pedido, entidad: string, comentario: string, valor : number): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "idPedido": pedido.id,
      "entidad": entidad,
	    "comentario": comentario,
	    "valor": String(valor),
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };
  
    const url = this.URL + 'pedido/realizarValoracion';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log("DATOS:")
        console.log(data)
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else if (data.includes("Ya has valorado")) {
          alert(data);
        } else {
          alert(this.restauranteSel + " valorado exitosamente");    
        }
      }, error: error => {
        alert("Ha ocurrido un error al hacer la valoración");
      }
    });  
  }

  peticionGetHttpValoracionHecha(pedido: Pedido, entidad: string, lista:number): void {
    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "idPedido": pedido.id,
      "entidad": entidad,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarExisteValoracion';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log(data)
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else if (data.includes("No hay")) {
          //alert(data);
          //poner valoracion en blanco
          this.clickEstrella(lista, 0);
          if(lista == 0){
            this.funciones.asignarValorID('comentario1', "");
          }else{
            this.funciones.asignarValorID('comentario2', "");
          }
        } else {
          //alert(this.restauranteSel + " valorado exitosamente"); 
          this.cargarDatosValoracionExistente(data, lista);  
        }
      }, error: error => {
        alert("Ha ocurrido un error al hacer la valoración");
      }
    }); 

  }

  cargarDatosValoracionExistente(data: string, lista:number){
    var val = new Valoracion(data, 0);
    var comentarioCampo;
    this.clickEstrella(lista, Number(val.valor));
    if(lista == 0){
      comentarioCampo = document.getElementById("comentario1") as HTMLInputElement;
    }else{
      comentarioCampo = document.getElementById("comentario2") as HTMLInputElement;
    }
    comentarioCampo.value = val.comentario;
  }

  mostrarDetallesPlato(plato: Plato){
    var esVeg;
    if(plato.veganoP){
      esVeg = "Si";
    }else{
      esVeg = "No";
    }
    alert("Descripción:"+ plato.descripcionP+'\n'+"Es : "+esVeg);
  }
}
