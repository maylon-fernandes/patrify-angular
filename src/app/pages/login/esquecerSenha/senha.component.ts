import { Component } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.scss']
})
export class SenhaComponent {

  cnpj: string = '';
  email:string   = '';


   
  constructor(private backendService: BackendService) {}
  

  recpassword(){
      const userData = this.prepareuserdata()

      this.backendService. updatePassword(userData) 
      .pipe(
        
      )
      .subscribe();
  }

  prepareuserdata() {
    const data = {
      email: this.email,
      cnpj: this.cnpj,
    };
  
    return data;
  }

}
