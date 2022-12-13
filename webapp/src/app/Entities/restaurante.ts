export class Restaurante {

    nombre : string;
    categoria : string;
    razon_social : string;
    valoracion : string;
    direccion : string;
    correo : string;
    telefono : number;
    CIF : string;
    pos: number;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.nombre = jsonObject.nombre;
        this.categoria = jsonObject.categoria;
        this.razon_social = jsonObject.razonSocial;
        //this.valoracion = Number(jsonObject.valoracion).toFixed(1);
        this.valoracion = '0.0';
        this.direccion = jsonObject.direccion;
        this.correo = jsonObject.email;
        this.telefono = parseInt(jsonObject.telefono);
        this.CIF = jsonObject.cif;
        this.pos = pos;
    }
}
