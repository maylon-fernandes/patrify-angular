// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, HostListener, OnInit } from '@angular/core';
// import { BackendService } from 'src/app/service/backend.service';
// import { b64toBlob } from 'src/app/utils/utils';

// @Component({
//   selector: 'app-inventario',
//   templateUrl: './inventario.component.html',
//   styleUrls: ['./inventario.component.scss']
// })
// export class InventarioComponent implements OnInit{
//   imageSrc!: string | null;
//  // Initialize imageSrc to null
//   indiceAtual: number = 0;
//   token: string | null = null;
//   constructor(private http: HttpClient, private backendService: BackendService) { }

  
//   ngOnInit(): void {

//  // Retrieve authorization header from localStorage
 
//         this.token = localStorage.getItem('token');
//         console.log('Token recuperado do localStorage:', this.token);
//         if (this.token) {
//           this.backendService.listPatry(this.token)
//             .subscribe(
//               response => {

                

//                 console.log(response.patrimonios)
//                 response.patrimonios.forEach((patrimonio: { imagem: string; }, indice: number) => {
//                   // Define o índice atual
//                   let imagem = patrimonio.imagem
//                   this.indiceAtual = indice;
//                   // console.log(imagem)
//                   // Converte a imagem para URL
//                   const blob = b64toBlob(imagem, 'image/jpeg'); // Ajustar tipo se necessário
//                   const objectURL = URL.createObjectURL(blob);
//                   console.log(objectURL)
//                   // Atribui a URL da imagem e o índice atual à variável `imageSrc`
//                   this.imageSrc = objectURL
            
//                   // Exibe a imagem e o índice atual (pode ser adaptado à sua necessidade)
//                   console.log(`Imagem do patrimônio ${this.indiceAtual + 1}: ${objectURL}`);
//                 });
//               },
//               error => {
//                 // Manipular erros de autenticação aqui (por exemplo, exibir mensagem de erro)
//                 console.error('Erro ao verificar autenticação do usuário:', error);
//               }
//             );
      
//         } else {
//           console.error('Token não encontrado no localStorage.');
//         }
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';
import { b64toBlob } from 'src/app/utils/utils';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  patrimonios: any[] = []; // Array to store all patrimonios
  token: string | null = null;

  constructor(private http: HttpClient, private backendService: BackendService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    console.log('Token recuperado do localStorage:', this.token);
    
    if (this.token) {
      this.backendService.listPatry(this.token)
        .subscribe(
          response => {
            console.log(response.patrimonios);

            this.patrimonios = response.patrimonios.map((patrimonio: any) => {
              const dateString = patrimonio.patr_dt_compra
              const date = new Date(dateString);
              const formattedDate = date.toLocaleDateString('pt-BR'); 

              const imagem = patrimonio.imagem;
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
    } else {
      console.error('Token não encontrado no localStorage.');
    }
  }
}
