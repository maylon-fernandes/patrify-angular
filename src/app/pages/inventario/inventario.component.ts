
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';
import { b64toBlob } from 'src/app/utils/utils';

import { catchError, tap, throwError } from 'rxjs';

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

    // GUI EDIT
    
    editMode: boolean = false;  

    toggleEditMode(patrimonio: any): void {
      patrimonio.editMode = !patrimonio.editMode; // Toggle the edit mode for the specific item
    }
    
    saveChanges(patrimonio: any): void {
      const token = localStorage.getItem('token');
      console.log(token); // Verifique se o token está sendo recuperado corretamente
    
      console.log(patrimonio); // Verifique o objeto patrimonio para ver se possui a propriedade id
      const patrimonioID = patrimonio.patr_id;
    
      const dadosPatrimonios = {
        ativoinativo: patrimonio.patr_ativoinativo,
        depreciacao: patrimonio.patr_depreciacao,
        dt_compr: patrimonio.patr_dt_compr,
        id: patrimonio.patr_id,
        local: patrimonio.patr_local,
        name: patrimonio.patr_name,
        quantidade: patrimonio.patr_quantidade,
        tipo: patrimonio.patr_tipo,
        valor: patrimonio.patr_valor
      };
    
      console.log(dadosPatrimonios);
      console.log(patrimonioID);
    
      if (token) {
        if (patrimonioID) { // Verifica se patrimonio e patrimonio.id são definidos
          this.backendService.salvarEdicaoDoPatrimonio(dadosPatrimonios, patrimonioID, token)
            .pipe(
              tap((response) => {
                console.log('Resposta do backend:', response);
                patrimonio.editMode = false;
                // Lidar com a resposta do backend, se necessário
              }),
              catchError(error => {
                console.error('Erro ao atualizar o patrimônio:', error);
                // Lidar com erros durante a solicitação de atualização do patrimônio
                return throwError(error);
              })
            )
            .subscribe();
        } else {
          console.error('ID do patrimônio não encontrado!');
        }
      } else {
        console.error('Token não encontrado!');
      }
    }
    
    

}
