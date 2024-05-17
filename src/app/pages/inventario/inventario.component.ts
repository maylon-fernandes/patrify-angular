
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';
import { b64toBlob } from 'src/app/utils/utils';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  filtros: any = [];
  patrimonios: any = []; // Array to store all patrimonios
  token: string | null = null;
  @Input() data: any;

  constructor(private http: HttpClient, private backendService: BackendService) {}
  
  onDataReady(filteredData: any) {
    this.filtros = filteredData; // Update the inventory list with filtered data
    console.log(this.filtros);

    this.token = localStorage.getItem('token');
    console.log('Token recuperado do localStorage:', this.token);
    
    if (this.token) {
      this.backendService.Filter(this.filtros, this.token).subscribe(
        response => {
            console.log(response.patrimonios);

            this.patrimonios = response.patrimonios.map((patrimonio: any) => {
            const dateString = patrimonio.patr_dt_compra
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('pt-BR'); 

            const imagem = patrimonio.imagem;
            // Sconsole.log(imagem)
            const blob = b64toBlob(imagem, 'image/jpeg');
            const objectURL = URL.createObjectURL(blob);
            console.log(objectURL);


            return {
              ...patrimonio,
              date: formattedDate,
              imageSrc: objectURL
            };
          });
        },
        error => {
          console.error('Erro ao verificar autenticação do usuário:', error);
        }
      );
    }
    
  }
  
  ngOnInit(): void {
    // this.token = localStorage.getItem('token');
    // console.log('Token recuperado do localStorage:', this.token);
    
    // if (this.token) {
    //   this.backendService.listPatry(this.token)
    //     .subscribe(
    //       response => {
    //         console.log(response.patrimonios);

    //         this.patrimonios = response.patrimonios.map((patrimonio: any) => {
    //           const dateString = patrimonio.patr_dt_compra
    //           const date = new Date(dateString);
    //           const formattedDate = date.toLocaleDateString('pt-BR'); 

    //           const imagem = patrimonio.imagem;
    //           const blob = b64toBlob(imagem, 'image/jpeg');
    //           const objectURL = URL.createObjectURL(blob);
    //           console.log(objectURL);


    //           return {
    //             ...patrimonio,
    //             date: formattedDate,
    //             imageSrc: objectURL
    //           };
    //         });
    //       },
    //       error => {
    //         console.error('Erro ao verificar autenticação do usuário:', error);
    //       }
    //     );
    // } else {
    //   console.error('Token não encontrado no localStorage.');
    // }
  }
}
