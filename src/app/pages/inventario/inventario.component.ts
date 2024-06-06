
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
    this.filtros = filteredData; 

    this.token = localStorage.getItem('token');
    
    if (this.token) {
      this.backendService.Filter(this.filtros, this.token).subscribe(
        response => {

            this.patrimonios = response.patrimonios.map((patrimonio: any) => {
            const dateString = patrimonio.patr_dt_compr
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('pt-BR'); 

            const imagem = patrimonio.imagem;
           


            return {
              ...patrimonio,
              date: formattedDate,
              imageSrc: imagem
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
    
  }
}
