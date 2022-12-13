export class LoginUsuario {
    nombre : string
    categoria : string
    razon_social : string
    valoracion : GLfloat
    direccion : string
    correo : string
    telefono : number
    CIF : string
  
    constructor( nombre : string, categoria : string, razon_social : string, valoracion : GLfloat, direccion : string, correo : string, telefono : number, CIF : string) {
      this.correo = correo;
      this.CIF = CIF
      this.categoria = categoria
      this.nombre = nombre
      this.telefono = telefono
      this.valoracion = valoracion
      this.direccion = direccion
      this.razon_social = razon_social
    }
  }
  