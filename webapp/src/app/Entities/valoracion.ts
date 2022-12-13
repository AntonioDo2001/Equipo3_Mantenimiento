export class Valoracion {

    entidad: string ;
	comentario: string ;
	valor: string ;
	autor: string ;
	fecha: string ;
    pos : number;
    idPedido : string;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.entidad = jsonObject.entidad;
        this.comentario = jsonObject.comentario;
        this.valor = jsonObject.valor;
        this.autor = jsonObject.autor;
        this.fecha = jsonObject.fecha;
        this.pos = pos;
        this.idPedido = jsonObject.idPedido;
    }
}