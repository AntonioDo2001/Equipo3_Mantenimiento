export class Cliente {

    nombre : string;
    apellidos : string;
    nif : string;
    telefono: number;
    correo : string;
    pwd : string;
    direccion : string;
    pos : number;
    activo: boolean;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.nombre = jsonObject.nombre;
        this.apellidos = jsonObject.apellidos;
        this.nif = jsonObject.nif;
        this.telefono = parseInt(jsonObject.telefono);
        this.correo = jsonObject.correo;
        this.pwd = jsonObject.contraseña;
        this.direccion = jsonObject.direccion;
        this.activo = Boolean(jsonObject.activo);
        this.pos = pos;
    }
}