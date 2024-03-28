import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SenhaComponent } from './pages/login/esquecerSenha/senha.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { SidebarComponent } from './pages/global/sidebar/sidebar.component';
import { HeaderComponent } from './pages/global/header/header.component';
import { FiltroComponent } from './pages/inventario/filtro/filtro.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SenhaComponent,
    InventarioComponent,
    SidebarComponent,
    HeaderComponent,
    FiltroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
