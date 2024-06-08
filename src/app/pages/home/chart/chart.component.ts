import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from "node_modules/chart.js";
import { BackendService } from 'src/app/service/backend.service';
Chart.register(...registerables)

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit{
  patrimonios: any[] = [];
  filtros: any[] = []; 
  token: string | null = '';
  tipospatr: any = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.filterfunction().then((tiposPatrimonios: any) => {
      this.tipospatr = tiposPatrimonios;
      this.renderChart(this.tipospatr);
    }).catch(error => {
      console.error(error);
    });
  }
  


  filterfunction() {
    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
  
      if (this.token) {
        this.backendService.Filter(this.filtros, this.token).subscribe(
          response => {
            if (response.patrimonios) {
              this.patrimonios = response.patrimonios.map((patrimonio: any) => {
                return {
                  ...patrimonio,
                };
              });
  
              // Contar o número de patrimônios
              const tiposPatrimonios: any = [];
  


              const contagemTipo: { contagem: number; tipo: any; }[] = []; // Array para contagem e tipo
              const ativoInativoContagemAtivo: { ativoinativo: any; contagemativ: number }[] = [];
              const resultadoFinal = [];

              this.patrimonios.forEach(patrimonio => {
                const tipo = patrimonio.patr_tipo;
                const ativoInativo = patrimonio.patr_ativoinativo;
                let contagemAtivo = 0;
              
                // Verifica se o tipo já existe no array de contagem/tipo
                const tipoExistenteContagem = contagemTipo.find(tipoContagem => tipoContagem.tipo === tipo);
              
                // Cria um novo objeto contagem/tipo se o tipo não existir
                if (!tipoExistenteContagem) {
                  contagemTipo.push({
                    contagem: 0,
                    tipo: tipo
                  });
                }
              
                // Atualiza as contagens do tipo encontrado (novo ou existente) no array contagem/tipo
                contagemTipo.forEach(tipoContagem => {
                  if (tipoContagem.tipo === tipo) {
                    tipoContagem.contagem++;
                  }
                });
              
                // Verifica se o tipo e ativo/inativo já existem no array ativo/inativo/contagemativ
                const ativoInativoExistente = ativoInativoContagemAtivo.find(
                  ativoInativoContagemAtivoItem =>
                    ativoInativoContagemAtivoItem.ativoinativo === ativoInativo
                );
              
                // Cria um novo objeto ativo/inativo/contagemativ se a combinação não existir
                if (!ativoInativoExistente) {
                  ativoInativoContagemAtivo.push({
                    ativoinativo: ativoInativo,
                    contagemativ: 0
                  });
                }
              
                // Atualiza as contagens do tipo e ativo/inativo encontrado (novo ou existente)
                ativoInativoContagemAtivo.forEach(ativoInativoContagemAtivoItem => {
                  if (
                    ativoInativoContagemAtivoItem.ativoinativo === ativoInativo 
                  ) {
                    ativoInativoContagemAtivoItem.contagemativ++;
                  }
                });
              });

              resultadoFinal.push(...contagemTipo);
              resultadoFinal.push(...ativoInativoContagemAtivo);


              resolve(resultadoFinal); // Resolve the Promise with the result
            } else {
              console.error('Erro ao recuperar patrimônios da API: ', response);
              reject('Erro ao recuperar patrimônios da API');
            }
          },
          (error) => {
            console.error('Erro ao filtrar patrimônios: ', error);
            reject('Erro ao filtrar patrimônios');
          }
        );
      }
    });
  }
  
  



  renderChart(tipospatr: any){

    const filteredDataativ = tipospatr.filter((tipo: { ativoinativo: any; }) => tipo.ativoinativo);
    const filteredDatatipo = tipospatr.filter((tipo: { tipo: any; }) => tipo.tipo);

    const labels = filteredDatatipo.map((tipo: { tipo: any; }) => tipo.tipo);
    const tiposnumber = filteredDatatipo.map((tipo: { contagem: any; }) => tipo.contagem);

    const ativ = filteredDataativ.map((tipo: { ativoinativo: any; }) => tipo.ativoinativo);
    const numberativ = filteredDataativ.map((tipo: { contagemativ: any; }) => tipo.contagemativ);


    
   const myChart = new Chart("typechart", {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: '',
        data: tiposnumber,
        borderWidth: 1,
        backgroundColor: [
          '#380664',
          '#970086',
          '#b60084',
          '#ff7131',
          '#ff9e00'
        ],
      }]
    },
    
  });

  const Chart2  = new Chart("activechart", {
    type: 'doughnut',
    data: {
      labels: ativ,
      datasets: [{
        label: '',
        data: numberativ,
        borderWidth: 1,
        backgroundColor: [
          '#380664',
          '#ff9e00'
        ],
      }]
    },
    
  });
  }

}


