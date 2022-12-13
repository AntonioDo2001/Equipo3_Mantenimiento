import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtencionTelefonicaComponent } from './Components/atencion-telefonica/atencion-telefonica.component';
import { GestionComponent } from './Components/gestion/gestion.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { LoginComponent } from './Components/login/login.component';
import { Page404Component } from './Components/page404/page404.component';
import { PedidosClientesComponent } from './Components/pedidos-clientes/pedidos-clientes.component';
import { PedidosRiderComponent } from './Components/pedidos-rider/pedidos-rider/pedidos-rider.component';
import { RealizarPedidoAsistenciaTelefComponent } from './Components/realizar-pedido-asistencia-telef/realizar-pedido-asistencia-telef.component';
import { RegistroComponent } from './Components/registro/registro.component';

//rutas de navegacion
const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'gestion', component: GestionComponent},
  { path: 'gestion-rider', component: PedidosRiderComponent},
  { path: 'pedir', component: PedidosClientesComponent},
  { path: 'atenciontelefonica', component: AtencionTelefonicaComponent},
  { path: 'realizarPedidoAsistTelef', component: RealizarPedidoAsistenciaTelefComponent},
  { path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
