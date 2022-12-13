export class Rider {

    nombre : string;
    apellidos : string;
    nif : string;
    valoracion : number;
    correo : string;
    pwd : string;
    tipoVehiculo : number;
    matricula : string;
    carnet: boolean;
    cuenta: boolean;
    pos : number;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.nombre = jsonObject.nombre;
        this.apellidos = jsonObject.apellidos;
        this.nif = jsonObject.nif;
        this.valoracion = jsonObject.valoracion;
        this.correo = jsonObject.correo;
        this.pwd = jsonObject.contraseña;
        this.tipoVehiculo= jsonObject.tipoVehiculo;
        this.matricula = jsonObject.matricula;
        this.carnet = Boolean(jsonObject.carnet);
        this.cuenta = Boolean(jsonObject.activo);
        this.pos = pos;
    }
}