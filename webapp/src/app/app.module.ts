import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { LoginComponent } from './Components/login/login.component';
import { RouterModule } from '@angular/router';
import { Page404Component } from './Components/page404/page404.component';
import { RegistroComponent } from './Components/registro/registro.component';
import { GestionComponent } from './Components/gestion/gestion.component';
import { GestionRestaurantesComponent } from './Components/gestion-restaurantes/gestion-restaurantes.component';
import { GestionClientesComponent } from './Components/gestion-clientes/gestion-clientes.component';
import { GestionRidersComponent } from './Components/gestion-riders/gestion-riders.component';
import { GestionAdminsComponent } from './Components/gestion-admins/gestion-admins.component';

import { GestionPedidosComponent } from './Components/gestion-pedidos/gestion-pedidos.component';
import { PedidosClientesComponent } from './Components/pedidos-clientes/pedidos-clientes.component';
import { PedidosRiderComponent } from './Components/pedidos-rider/pedidos-rider/pedidos-rider.component';
import { AtencionTelefonicaComponent } from './Components/atencion-telefonica/atencion-telefonica.component';
import { RealizarPedidoAsistenciaTelefComponent } from './Components/realizar-pedido-asistencia-telef/realizar-pedido-asistencia-telef.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    Page404Component,
    RegistroComponent,
    GestionComponent,
    GestionRestaurantesComponent,
    GestionClientesComponent,
    GestionRidersComponent,
    GestionAdminsComponent,
    GestionPedidosComponent,
    PedidosClientesComponent,
    PedidosRiderComponent,
    AtencionTelefonicaComponent,
    RealizarPedidoAsistenciaTelefComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
