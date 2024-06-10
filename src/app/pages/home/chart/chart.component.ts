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
  // filtros: any[] = []; 
  token: string | null = '';
  tipospatr: any = [];
  lastValue: any;
  filtros = {
    tipo: 'Todos',
    name: 'Mais antigo',
    status: '',
    preco: '',
    data_aquisicao: '',
    condicao: ''
  }
  patrimoniostotal: any;
  patrimoniosativos: any;
  patrimoniosnaoativos: any;
  lastvaluenotactive: any;

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
      console.log(this.filtros)
      if (this.token) {
        this.backendService.Filter(this.filtros, this.token).subscribe(
          response => {
            if (response.patrimonios) {
              this.patrimonios = response.patrimonios.map((patrimonio: any) => {
                return {
                  ...patrimonio,
                };
              });
  


              const contagemTipo: { contagem: number; tipo: any; }[] = []; // Array para contagem e tipo
              const ativoInativoContagemAtivo: { ativoinativo: any; contagemativ: number }[] = [];
              const dtcomprvalueativ: { comprativ: any; valueativ: number }[] = [];
              const dtcomprvaluenotativ:  { valuenot: number }[] = [];
              
              let valorAcumulado = 0; // Valor acumulado inicializado a zero
              let naoativoacumulado= 0;
              
              const resultadoFinal = [];

              this.patrimonios.forEach(patrimonio => {
                const tipo = patrimonio.patr_tipo;
                const ativoInativo = patrimonio.patr_ativoinativo;
                const compra = patrimonio.patr_dt_compr; 
                const valorRaw = patrimonio.patr_valor;
                const quantity = patrimonio.patr_quantidade;
                let contagemAtivo = 0;
                let valor: number = 0;

              
                try {
                  valor = parseFloat(valorRaw);
                  if (isNaN(valor)) {
                    throw new Error('Valor inválido');
                  }
                } catch (e) {
                  console.warn(`Valor inválido: ${valorRaw}`);
                }

                const dateString = patrimonio.patr_dt_compr;

                const dateParts = dateString.split('-');
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1;
                const day = parseInt(dateParts[2], 10);

                const dateObject = new Date(year, month, day);

                const formattedDate = dateObject.toLocaleDateString('pt-BR');




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



                if(patrimonio.patr_ativoinativo == 'Ativo'){
                  valorAcumulado += (valor * quantity);
                  const compraExistente = dtcomprvalueativ.find(
                      compraItem => compraItem.comprativ === formattedDate
                    );

                    
                    // Cria um novo objeto compra/valor se a combinação não existir
                    if (!compraExistente) {
                      dtcomprvalueativ.push({
                        comprativ: formattedDate,
                        valueativ:  valorAcumulado
                      });
                      
                    } else {
                      // Atualiza os valores da compra encontrada (novo ou existente)
                      compraExistente.valueativ = valorAcumulado;
                    }

                  }else{

                    naoativoacumulado += (valor * quantity);
                    dtcomprvaluenotativ.push({
                      valuenot: naoativoacumulado
                    })
                   

                  }

                  
                 
              
              });


              resultadoFinal.push(...contagemTipo);
              resultadoFinal.push(...ativoInativoContagemAtivo);
              resultadoFinal.push(...dtcomprvalueativ)              
              resultadoFinal.push(...dtcomprvaluenotativ)

              console.log(resultadoFinal)
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
    const filteredDatavalor = tipospatr.filter((tipo: { comprativ: any; }) => tipo.comprativ);
    
    const filteredDatavalornotactive = tipospatr.filter((tipo: { valuenot: any; }) => tipo.valuenot);
    

    const labels = filteredDatatipo.map((tipo: { tipo: any; }) => tipo.tipo);
    const tiposnumber = filteredDatatipo.map((tipo: { contagem: any; }) => tipo.contagem);

    const ativ = filteredDataativ.map((tipo: { ativoinativo: any; }) => tipo.ativoinativo);
    const numberativ = filteredDataativ.map((tipo: { contagemativ: any; }) => tipo.contagemativ);

    const dataativ = filteredDatavalor.map((tipo: { comprativ: any; }) => tipo.comprativ);
    const valorativ = filteredDatavalor.map((tipo: { valueativ: any; }) => tipo.valueativ);

    const data = filteredDatavalornotactive.map((tipo: { compr: any; }) => tipo.compr);
    const valor = filteredDatavalornotactive.map((tipo: { valuenot: any; }) => tipo.valuenot);


    this.lastValue = valorativ[valorativ.length - 1];
    this.patrimoniostotal = numberativ[0]+numberativ[1];
    this.patrimoniosativos = numberativ[1];
    this.patrimoniosnaoativos = numberativ[0];
    this.lastvaluenotactive = valor[valor.length-1]

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

  
  const Chart3  = new Chart("valuechart", {
    type: 'line',
    
    data: {
      labels: dataativ,
      datasets: [{
        label: '',
        data: valorativ,
        borderWidth: 1,  
        borderColor: '#380664',
        tension: 0.3,
        pointStyle: 'rectRot',
        backgroundColor: '#38066467',
        fill: true
      }],
          
      },
      options: {
        
        plugins: {
          legend: {
            display: false // Hide legend (already set in your original code)
          }
        }
      }
    });

  }
}

  


