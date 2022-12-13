import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Restaurante } from 'src/app/Entities/restaurante';
import { Router } from '@angular/router';
import { DomSanitizer, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { Url } from 'src/app/Entities/url';
import { FuncionesService } from 'src/app/services/funcionesServices';
import { Plato } from 'src/app/Entities/plato';
import { Pedido } from 'src/app/Entities/pedido';
import { LineaPlato } from 'src/app/Entities/lineaPlato';
import { Valoracion } from 'src/app/Entities/valoracion';
import { HelperService } from 'src/app/Entities/HelperService';

//import { converBase64ToImage } from 'convert-base64-to-image';


@Component({
  selector: 'app-atencion-telefonica',
  templateUrl: './atencion-telefonica.component.html',
  styleUrls: ['./atencion-telefonica.component.css']
})
export class AtencionTelefonicaComponent implements OnInit {

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
  correoClientePedidoModificar = "";

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
    this.mostrar_pedidos();
    
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

  

  peticionHttpGetPedidos() {
    if(this.restauranteSelect == ''){

    }
    else{
      
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
    
  }

  
  

  mostrar_pedidos() {
      this.ocultarTodo()
      this.funciones.ocultarBtn("pedidos_v", false);
      this.peticionHttpGetPedidos();

      this.funciones.disabledID('add_res', true);
      this.funciones.disabledID('update_res', true);
      this.funciones.disabledID('delete_res', true);

    

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
    if(pedido.id == null){
      alert("Error al cancelar pedido, seleccione un pedido");
    }
    else{
      const url = this.URL + 'pedido/cancelarPedido/' + pedido.id;
    this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
      next: data => {
        console.log(data)
         if (data.includes("Ya no puedes cancelar el pedido")) {
          alert("Ya no puedes cancelar el pedido ya que está entregado o en reparto");
        } else if (data.includes("No existe ese pedido")) {
          alert("Ningún pedido seleccionado");
        } else {
          alert("Pedido cancelado correctamente");
          this.peticionHttpGetPedidos();
          this.pedidoSelTotal = ""
          this.listaPlatosPedidoSel = []
          this.listaPlatos = []
          this.pedidoSel = new Pedido(1,"",999)
          this.onSelectPed(this.pedidoSel)
        }
      }, error: error => {
        alert("Ha ocurrido un error al cancelar el pedido del cliente");
      }
    });
    }
    
  }


  cancelarPedido(){
    this.peticionHttpCancelarPedido(this.pedidoSel)
    
    
  }


  ocultarTodo() {
    this.funciones.ocultarBtn("datos_v", true);
    this.funciones.ocultarBtn("carta_v", true);
    this.funciones.ocultarBtn("facturas_v", true);
    this.funciones.ocultarBtn("pedidos_v", true);
  }

  onSelect(element: Restaurante) {
    this.disabledTodos(true);
    this.restauranteSelect = element.nombre;
    this.peticionHttpGetPedidos();

    this.funciones.apagarElementosLista('listaRestaurantes');
    this.funciones.resaltarElementoLista('listaRestaurantes', element.pos);

    
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
      this.funciones.asignarValorID('estadoPed', "");
    }

    this.funciones.asignarValorID('riderPed', element.rider);
  }

  realizarPedidos(){
    this.router.navigate(['/realizarPedidoAsistTelef']);
  }

  

  

  

  



  

  
  
  
    
  
}
