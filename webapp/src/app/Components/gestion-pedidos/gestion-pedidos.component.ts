import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/Entities/pedido';
import { Plato } from 'src/app/Entities/plato';
import { Restaurante } from 'src/app/Entities/restaurante';

import { FuncionesService } from 'src/app/services/funcionesServices';
import { Url } from 'src/app/Entities/url';
import { DomSanitizer, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { LineaPlato } from 'src/app/Entities/lineaPlato';


@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css']
})
export class GestionPedidosComponent implements OnInit {

  listaRestaurantes: Restaurante[] = [];
  listaPlatosPedidoSel: LineaPlato[] = [];
  listaPedidosRepartir: Pedido[] = [];
  listaPedidosPreparacion: Pedido[] = [];
  pedidoSel: Pedido;
  restauranteSel: string = "";
  pedidoSelTotal: string = "";
  funciones = new FuncionesService();

  URL: string = new Url().url;


  constructor(private router: Router, private http: HttpClient) {
    this.pedidoSel = new Pedido(1, "", 0);
  }

  ngOnInit(): void {
    this.peticionGetHttp();
    this.peticionGetPedidosEnHttp();
  }

  onSelect(element: Restaurante) {
    console.log(element);
    this.restauranteSel = element.nombre;
    this.peticionGetPedidosPrepHttp();
    this.peticionGetPedidosEnHttp();
    this.funciones.apagarElementosLista('listaRestaurantesPed');
    this.funciones.resaltarElementoLista('listaRestaurantesPed', element.pos);
  }

  onSelectPedRep(element: Pedido) {
    console.log(element);

    this.pedidoSel = element;
    this.ocultarTodo();
    this.funciones.ocultarBtn('entregar_ped',false);

    this.funciones.apagarElementosLista('listaPedidosRepartir');
    this.funciones.apagarElementosLista('listaPedidosPreparacion');
    this.funciones.resaltarElementoLista('listaPedidosRepartir', element.pos);

    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, this.restauranteSel);
    this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);
  }

  onSelectPedPrep(element: Pedido) {
    console.log(element);
    this.pedidoSel = element;
    this.ocultarTodo();
    this.funciones.ocultarBtn('asignar_ped',false);
    this.funciones.apagarElementosLista('listaPedidosRepartir');
    this.funciones.apagarElementosLista('listaPedidosPreparacion');
    this.funciones.resaltarElementoLista('listaPedidosPreparacion', element.pos);

    this.listaPlatosPedidoSel = this.funciones.genPlatosPedido(element, this.restauranteSel);
    this.pedidoSelTotal = this.funciones.calcularTotalPedido(this.listaPlatosPedidoSel).toFixed(2);
  }


  ocultarTodo() {
    this.funciones.ocultarBtn('asignar_ped',true);
    this.funciones.ocultarBtn('entregar_ped',true);
  }

  asignar_ped() {
    this.peticionHttpAsignar();
    this.ocultarTodo();
  }

  entregar_ped() {
    this.peticionHttpEntregar();
    this.ocultarTodo();
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

  peticionHttpAsignar(): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "idPedido": this.pedidoSel.id,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/asignarsePedido';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No se ha podido asignar el pedido")) {
          alert(data);
        } else if (data.includes("El pedido ya ha sido asignado")) {
          alert(data);
        } else if (data.includes("No te puedes asignar a mas pedidos")) {
          alert("No te puedes asignar a más pedidos");
        } else if (data.includes("El pedido ya ha sido entregado")) {
          alert(data);
        } else {
          alert("Pedido asignado exitosamente");
          this.peticionGetPedidosPrepHttp();
          this.peticionGetPedidosEnHttp();
          this.recargar();
        }
      }, error: error => {
        alert("Ha ocurrido un error al asignar el pedido");
      }
    });
  }



  peticionHttpEntregar(): void {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      "idPedido": this.pedidoSel.id,
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/entregarPedido';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
          this.router.navigate(['/login']);
        } else if (data.includes("No te corresponde entregar este pedido")) {
          alert(data);
        } else if (data.includes("No existe ese pedido")) {
          alert(data);
        } else if (data.includes("El pedido ya ha sido entregado")) {
          alert(data);
        } else if (data.includes("Debes asignarte primero")) {
          alert(data);
        } else {
          alert("Pedido entregado exitosamente");
          //this.peticionGetPedidosPrepHttp();
          this.peticionGetPedidosEnHttp();
          this.recargar();
        }
      }, error: error => {
        alert("Ha ocurrido un error al entregar el pedido");
      }
    });
  }

  peticionGetPedidosPrepHttp(): void {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarPedidosPreRider/' + this.restauranteSel;
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaPedidosPreparacion = [];
        if (data.length == 0) {
          //alert(window.sessionStorage.getItem('rol'));
          alert("Este restaurante no tiene pedidos en preparación");
        } else {
          if (data.includes("No tienes acceso a este servicio")) {
            alert("No tienes acceso a este servicio");
            this.router.navigate(['/login']);
          } else if (data.includes("No hay pedidos")) {
            alert("Este restaurant no tiene pedidos");
          } else if (data.includes("No existe ese restaurante")) {
            alert("No existe ese restaurante");
          } else if (data.includes("Tu cuenta no se encuentra activa")) {
            alert("Tu cuenta no se encuentra activa");
          } else {
            var listaPedJSON = data.split(";;;");
            for (let i = 0; i < listaPedJSON.length; i++) {
              //console.log(listaResJSON[i]);
              let pedido = new Pedido(0, listaPedJSON[i], i);
              if (pedido.estado == 0) {
                this.listaPedidosPreparacion.push(pedido);
              }
              console.log(this.listaPedidosPreparacion[i]);
            }
          }
        }
      }, error: error => {
        //this.router.navigate(['/login']);
        //alert("Ha ocurrido un error al cargar los pedidos");
        alert(error.message);
      }
    });
  }

  peticionGetPedidosEnHttp(): void {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = {
      "correoAcceso": window.sessionStorage.getItem('correo'),
      "passwordAcceso": window.sessionStorage.getItem('password')
    };

    const url = this.URL + 'pedido/consultarPedidosEnRider/';
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        this.listaPedidosRepartir = [];

        if (data.includes("No tienes acceso a este servicio")) {
          alert("No tienes acceso a este servicio");
          this.router.navigate(['/login']);
        } else if (data.includes("No hay pedidos")) {
          //alert(data);
        } else if (data.includes("Tu cuenta no se encuentra activa")) {
          alert(data);
        } else {
          var listaPedJSON = data.split(";;;");
          for (let i = 0; i < listaPedJSON.length; i++) {
            //console.log(listaResJSON[i]);
            let pedido = new Pedido(0, listaPedJSON[i], i);
            if (pedido.estado == 1) {
              this.listaPedidosRepartir.push(pedido);
            }
            console.log(this.listaPedidosRepartir[i]);
          }
        }
      }, error: error => {
        //this.router.navigate(['/login']);
        //alert("Ha ocurrido un error al cargar los pedidos");
        alert(error.message);
      }
    });
  }

  logout() {
    window.sessionStorage.removeItem('rol');
    window.sessionStorage.removeItem('correo');
    window.sessionStorage.removeItem('password');
    this.router.navigate(['/inicio']);
  }

  recargar(){
    this.ocultarTodo();
    this.peticionGetHttp();
    this.peticionGetPedidosEnHttp();
    this.pedidoSel= new Pedido(1,"",0);
    this.listaPlatosPedidoSel = [];
    this.pedidoSelTotal = "";
  }
}
