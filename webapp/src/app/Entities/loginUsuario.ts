export class LoginUsuario {
  correo: string;
  pwd: string;

  constructor(correo: string, pwd: string) {
    this.correo = correo;
    this.pwd = pwd;
  }
}
