import { Component } from '@angular/core';

@Component({
  selector: 'filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent {
  mostrarAddPatrimonio: boolean = false;

  alternarAddPatrimonio() {
    this.mostrarAddPatrimonio = !this.mostrarAddPatrimonio;
  }
}
