import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {

  dadosCNPJ: any;

  constructor(private http: HttpClient,
    private BackendService: BackendService
  ) { }

  ngOnInit(): void {
    // Supondo que você tem o CNPJ do usuário logado disponível na variável cnpjLogado
    const cnpjLogado = '62.823.257/0068-08';

   // Remova os caracteres não numéricos do CNPJ
   const cnpjFormatado = cnpjLogado.replace(/\D/g, '');

   // Fazendo a requisição GET à rota /buscar-cnpj/:cnpj usando o BackendService
   this.BackendService.buscarCNPJ(cnpjFormatado).subscribe(
     (data) => {
      // Armazene os dados do CNPJ na variável dadosCNPJ
      this.dadosCNPJ = data;
       // Manipule os dados recebidos aqui
       console.log('Dados do CNPJ:', data);
     },
     (error) => {
       // Lidar com erros aqui
       console.error('Erro ao buscar dados do CNPJ:', error);
     }
   );
 }

 formatarData(data: number): string {
  const dataFormatada = new Date(data);
  dataFormatada.setMinutes(dataFormatada.getMinutes() + dataFormatada.getTimezoneOffset());
  return dataFormatada.toLocaleDateString();
}
}