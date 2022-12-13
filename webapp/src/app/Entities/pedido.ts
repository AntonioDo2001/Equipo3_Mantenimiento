export class Pedido {

    id : string;
    restaurante : string;
    listaPlatos : string;
    listaFotos : string; 
    total : number;
    pos : number;
    rider : string;
    estado : number;
    cliente : string;
    fecha : string;

    
    constructor(mode:number, json:string, pos:number){
        if(mode == 0){
            var jsonObject = JSON.parse(json);
            this.id = jsonObject.idPedido;
            this.restaurante = jsonObject.restaurante;
            this.listaPlatos = jsonObject.platos;
            this.rider = jsonObject.rider;
            this.total = Number(jsonObject.total);
            this.pos = Number(pos);
            this.estado =  Number(jsonObject.estado);
            this.cliente = jsonObject.cliente;
            this.fecha = jsonObject.fecha;
            this.listaFotos = '';
        }else{
            this.id = "0";
            this.restaurante = "";
            this.listaPlatos = "";
            this.total = 0;
            this.pos = 0;
            this.rider = "";
            this.estado = -1;
            this.cliente = "";
            this.fecha = "";
            this.listaFotos = '';
        }
    }
}