export class Admin {

    nombre : string;
    apellidos : string;
    zona : string;
    nif : string;
    correo : string;
    pwd : string;
    pos : number;
    
    constructor(json:string, pos:number){
        var jsonObject = JSON.parse(json);
        this.nombre = jsonObject.nombre;
        this.apellidos = jsonObject.apellidos;
        this.zona = jsonObject.zona;
        this.nif = jsonObject.nif;
        this.correo = jsonObject.correo;
        this.pwd = jsonObject.contraseña;
        this.pos = pos;
    }
}