import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LineaPlato } from 'src/app/Entities/lineaPlato';
import { Pedido } from 'src/app/Entities/pedido';
import { Plato } from 'src/app/Entities/plato';
import { Restaurante } from 'src/app/Entities/restaurante';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';

@Component({
  selector: 'app-realizar-pedido-asistencia-telef',
  templateUrl: './realizar-pedido-asistencia-telef.component.html',
  styleUrls: ['./realizar-pedido-asistencia-telef.component.css']
})
export class RealizarPedidoAsistenciaTelefComponent implements OnInit {
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
  correoClientePedido = ""

  valorRes: number = 0;
  valorRid: number = 0;



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
            var rest = new Restaurante(listaResJSON[i], i);
            this.listaRestaurantes.push(rest)
          }
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

          this.listaPlatos = [];
          if (data.length == 0) {
            //alert(window.sessionStorage.getItem('rol'));
            alert("No hay carta en ese restaurante");
          } else {
            var listaCartaJSON = data.split(";;");
            for (let i = 0; i < listaCartaJSON.length; i++) {
              this.listaPlatos.push(new Plato(listaCartaJSON[i], i))
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

    this.funciones.ocultarBtn('btn_cancelarPed', false);

    
    this.funciones.apagarElementosLista('listaPedidosEnProgreso');
    this.funciones.apagarElementosLista('listaPedidosEntregados');
    this.funciones.resaltarElementoLista('listaPedidosEnProgreso', element.pos);


  }

  onSelectPedPend(element: Pedido) {
    this.listaPlatosPedidoSel = [];
    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, element.restaurante);
    this.pedidoSel = element;
  
    
    this.funciones.apagarElementosLista('listaPedidosPendientes');
    this.funciones.resaltarElementoLista('listaPedidosPendientes', element.pos);
  }

  ocultarTodo() {
    this.funciones.ocultarBtn("contenedor_pedir", true);
    this.funciones.ocultarBtn("contenedor_carrito", true);
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

  peticionHttpOrdenarPedidoEnCarrito(correoCliente: any): void {
    if (!(this.pedidoSel.restaurante == "")) {
      this.correoClientePedido = correoCliente
      this.pedidoSel.cliente = this.correoClientePedido
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
      "correoAcceso": pedido.cliente,
      "passwordAcceso": "sinAsignar"
    };

    const url = this.URL + 'pedido/crearPedido/';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
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

  

  cancelarCambiosActualizar() {
    this.funciones.ocultarBtn('btn_udp_datosCli', false);
    this.funciones.ocultarBtn('cont_confirm_udt_cli', true);
    this.disableCamposUpd(true);
  }

  disableCamposUpd(valor: boolean) {
    this.funciones.disabledID('nombreCli', valor);
    this.funciones.disabledID('apellidosCli', valor);
    this.funciones.disabledID('telCli', valor);
    this.funciones.disabledID('passwordCli', valor);
    this.funciones.disabledID('direccionCli', valor);
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


  irAsistenciaTelefonica(){
    this.router.navigate(['/atenciontelefonica']);
  }
}


