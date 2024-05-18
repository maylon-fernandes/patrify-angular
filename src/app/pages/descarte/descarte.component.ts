import { Component } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'app-descarte',
  templateUrl: './descarte.component.html',
  styleUrls: ['./descarte.component.css']
})
export class DescarteComponent {
  constructor(private backendService: BackendService){}
  localData:any = [];
  location:any;
  resultLocal: any = [];

   procuraLocal(tipo:any) {
    this.localData = tipo; 
    if (tipo) {
      this.backendService.localDescarte(this.localData).subscribe(
        response => {
          this.resultLocal = response.resultLocal; 
        }
      )
    }
  }

}
