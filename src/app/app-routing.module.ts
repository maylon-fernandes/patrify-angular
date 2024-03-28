import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { LoginComponent } from './pages/login/login.component';
import { SenhaComponent } from './pages/login/esquecerSenha/senha.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota para login page
  { path: 'inventario', component: InventarioComponent }, // Rata para inventory page
  {path: 'senha', component: SenhaComponent}, // Rota para esqueci a senha page
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
