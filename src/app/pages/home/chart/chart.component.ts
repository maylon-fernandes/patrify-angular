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
      console.log(this.tipospatr);
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
  
              this.patrimonios.forEach(patrimonio => {
                let tipoEncontrado = tiposPatrimonios.find((tipo: { tipo: any; }) => tipo.tipo === patrimonio.patr_tipo);
              
                if (!tipoEncontrado) {
                  tiposPatrimonios.push({
                    tipo: patrimonio.patr_tipo,
                    contagem: 1
                  });
                } else {
                  tipoEncontrado.contagem++;
                }
              });
  
              resolve(tiposPatrimonios); // Resolve the Promise with the result
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
    console.log(tipospatr)
    const labels = tipospatr.map((tipo: { tipo: any; }) => tipo.tipo);
    const data = tipospatr.map((tipo: { contagem: any; }) => tipo.contagem);

   const myChart = new Chart("typechart", {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: '',
        data: data,
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
  }

}


