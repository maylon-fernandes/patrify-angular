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

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.renderChart()

    this.filterfunction()

  }

  filterfunction(){
    
    this.token = localStorage.getItem('token');
    
    if (this.token) {
      this.backendService.Filter(this.filtros, this.token).subscribe(
        response => {
        this.patrimonios = response.patrimonios.map((patrimonio: any) => {
        

          return {
            ...patrimonio,
          };


        });

        // Count the number of patrimonios
        const patrimoniosCount = this.patrimonios.length;
        console.log('Número de patrimônios retornados:', patrimoniosCount);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

  renderChart(){
   const myChart = new Chart("piechart", {
    type: 'doughnut',
    data: {
      labels: ['PATRIMONIO'],
      datasets: [{
        label: '# of Votes',
        data: [4],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  }

}
