export class Plato {

    id : string;
    nombreP : string;
    precioP : string;
    veganoP : boolean;
    descripcionP : string;
    fotoP : string;
    restaurante : string;
    pos : number;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.nombreP = jsonObject.nombre;
        this.precioP = Number(jsonObject.precio).toFixed(2);
        this.descripcionP = jsonObject.descripcion;
        this.veganoP = Boolean(jsonObject.aptoVegano);
        this.fotoP = jsonObject.foto;
        this.restaurante = jsonObject.nombreRestaurante;
        this.id = jsonObject.idPlato;
        this.pos = pos;
    }
}