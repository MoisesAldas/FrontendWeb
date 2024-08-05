import { RouterModule, Routes } from '@angular/router';
import { Tabla1Component } from './views/tabla1/tabla1.component';
import { NgModule } from '@angular/core';
import { FinalDatatableComponent } from './views/final-datatable/final-datatable.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './client/index/index.component';
import { CatalogoComponent } from './client/catalogo/catalogo.component';
import { VideojuegoFormComponent } from './client/videojuego-form/videojuego-form.component';
import { ListarClientesComponent } from './client/listar-clientes/listar-clientes.component';
import { VideojuegoActualizarComponent } from './client/videojuego-actualizar/videojuego-actualizar.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tabla1',
    component: Tabla1Component,
  },
  {
    path: 'final-datatable',
    component: FinalDatatableComponent,
  },
  {
    path: 'voucher/:cedula',
    component: VoucherComponent,
  },

  //Rutas para cliente
  {
    path: 'index',
    component: IndexComponent,
  },
  {
    path: 'catalogo',
    component: CatalogoComponent,
  },
  {
    path: 'videojuego-form',
    component: VideojuegoFormComponent,
  },
  {
    path: 'ListarClientes',
    component: ListarClientesComponent,
  },
  {
    path: 'videojuego-actualizar/:id',
    component: VideojuegoActualizarComponent, // Ruta para actualizar videojuego
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
