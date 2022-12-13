import { formatNumber } from "@angular/common";

export class LineaPlato {

    nombreP : string;
    precioP : string;
    cantidad : string;
    restaurante : string;
    foto : string;
    
    constructor(nombre:string, precio:string, cantidad:string, restaurante:string){
        this.nombreP = nombre;
        this.precioP = precio;
        this.restaurante = restaurante;
        this.cantidad = cantidad;
        this.foto = "";
    }
}