import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/service/backend.service';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  token: string | null = null;
  textos: string[] = ["Gerencie", "Aprimore", "Proteja"];
  textoAtual: number = 0;
  i: number = 0;
  spanTexto!: HTMLElement; // Usando ! para indicar que spanTexto não será nulo
  errorMessage: string | null = null;
  constructor(private elementRef: ElementRef, private router: Router, private backendService: BackendService) { }

  fazerLogin() {
    window.open('/senha', '_blank');
  }

  ngOnInit(): void {
    this.spanTexto = this.elementRef.nativeElement.querySelector('#organize')!;
    this.iniciarLoop();
    const textLogin: HTMLElement | null = document.getElementById('linkLogin');
    const textRegistro: HTMLElement | null = document.getElementById('linkRegister');
    const loginPage: HTMLElement | null = document.querySelector('.login');
    const registerPage: HTMLElement | null = document.querySelector('.register');
    const inputLogin: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('.input-login');

    if (textRegistro && loginPage && registerPage) {
      textRegistro.addEventListener('click', () => {
        loginPage.style.transform = 'translateX(-100vw)';
        registerPage.style.transform = 'translateX(0vw)';

        if (inputLogin) {
          inputLogin.forEach(input => {
            input.value = '';
          });
        }
      });
    }

    if (textLogin && loginPage && registerPage) {
      textLogin.addEventListener('click', () => {
        registerPage.style.transform = 'translateX(-100vw)';
        loginPage.style.transform = 'translateX(0vw)';

        if (inputLogin) {
          inputLogin.forEach(input => {
            input.value = '';
          });
        }
      });
    }


    this.token = localStorage.getItem('token');
    console.log('Token recuperado do localStorage:', this.token);

    // Verificar se o usuário está autenticado usando o token
    if (this.token) {

      this.backendService.SignedUser(this.token)
        .subscribe(
          response => {
            // Manipular a resposta bem-sucedida aqui (por exemplo, exibir mensagem de sucesso)
            console.log(response);
            this.router.navigate(['/inventario']);
          },
          error => {
            // Manipular erros de autenticação aqui (por exemplo, exibir mensagem de erro)
            console.error('Erro ao verificar autenticação do usuário:', error);
          }
        );
    } else {
      console.error('Token não encontrado no localStorage.');
    }


  }

  escreverTexto(): void {
    if (this.spanTexto) {
      if (this.i < this.textos[this.textoAtual].length) {
        this.spanTexto.textContent += this.textos[this.textoAtual].charAt(this.i);
        this.i++;
        setTimeout(() => this.escreverTexto(), 100); // Ajuste o valor do timeout para controlar a velocidade da digitação
      } else {
        setTimeout(() => this.apagarTexto(), 1000); // Aguarda 1 segundo e depois inicia a função para apagar o texto
      }
    }
  }

  apagarTexto(): void {
    if (this.spanTexto) {
      const textoAtualString: string = this.textos[this.textoAtual];
      this.i = textoAtualString.length;
      const interval = setInterval(() => {
        if (this.spanTexto) {
          if (this.i >= 0) {
            this.spanTexto.textContent = textoAtualString.slice(0, this.i);
            this.i--;
          } else {
            clearInterval(interval); // Para o setInterval quando o texto foi totalmente apagado
            this.textoAtual++;
            if (this.textoAtual >= this.textos.length) {
              this.textoAtual = 0; // Reseta para o primeiro texto quando chegar ao último
            }
            setTimeout(() => this.escreverTexto(), 500); // Aguarda meio segundo e inicia a função para escrever o próximo texto
          }
        }
      }, 100);
    }
  }

  iniciarLoop(): void {
    setTimeout(() => this.escreverTexto(), 500); // Aguarda meio segundo antes de começar a escrever o primeiro texto


    const btnEsqueciSenha: HTMLElement | null = document.querySelector('#forgotPassword');
    const btnCancelarSenha: HTMLElement | null = document.querySelector('#cancel-pass');
    const containerPassword: HTMLElement | null = document.querySelector('.container-password');




    if (btnCancelarSenha !== null && containerPassword !== null) {
      btnCancelarSenha.addEventListener('click', () => {
        containerPassword.style.display = 'none';
        const inputLoginFowardPass: NodeListOf<HTMLInputElement> = document.querySelectorAll('.input-fowardpass');
        inputLoginFowardPass.forEach(input => {
          input.value = '';
        });
      });
    }



    if (btnEsqueciSenha !== null && containerPassword !== null) {
      btnEsqueciSenha.addEventListener('click', () => {
        containerPassword.style.display = 'flex';
      });
    }

  }

  registerUser() {
    const form = document.getElementById('formRegister') as HTMLFormElement;
    if (!form) {
      console.error("Formulário não encontrado.");
      return;
    }
    const cnpj = form.elements.namedItem('cnpjreg') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('passwordreg') as HTMLInputElement;
    const reppassword = form.elements.namedItem('reppassword') as HTMLInputElement;
    
    if (!cnpj || !cnpj.value) {
      this.errorMessage = 'Por favor, informe um CNPJ.';
      return;
    }
    else if (!email || !email.value) {
      this.errorMessage = 'Por favor, informe um e-mail.';
      return;
    }
    else if (!password || !password.value) {
      this.errorMessage = 'Por favor, informe uma senha.';
      return;
    }
    else if(!reppassword || !reppassword.value) {
      this.errorMessage = 'Por favor, repita a senha correta';
      return;
    }
    else if (form ) {

      console.log('oiiuiiii');
      
      this.errorMessage = ''
      const senha = password.value;
      console.log(cnpj.value)
      if (this.validarSenhaForte(senha)) {
  
        // Fazendo requisição à API do BrasilAPI para obter informações da empresa pelo CNPJ
        axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.value}`)
          .then(response => {
            const dadosCNPJ = response.data;
            console.log(dadosCNPJ)
            // Construindo os dados do usuário com base nos dados da empresa retornados pela API
            const userData = {
              name: dadosCNPJ.nome_fantasia,
              cnpj: cnpj.value,
              telefone1: dadosCNPJ.ddd_telefone_1,
              telefone2: dadosCNPJ.ddd_telefone_2,
              email: email.value,
              razaoSocial: dadosCNPJ.razao_social,
              atividadeEconomica: dadosCNPJ.cnae_fiscal_descricao,
              endereco: `${dadosCNPJ.descricao_tipo_de_logradouro} ${dadosCNPJ.logradouro} Nº ${dadosCNPJ.numero}, ${dadosCNPJ.bairro}, ${dadosCNPJ.municipio} - ${dadosCNPJ.uf}`,
              password: password.value
            };
  
            // Chamando o serviço de backend para registrar o usuário
            this.backendService.registerUser(userData)
              .subscribe(
                response => {
                  console.log('Usuário registrado com sucesso:', response);
                },
                error => {
                  // Manipular erros de registro aqui (por exemplo, exibir mensagem de erro)
                  console.error('Erro ao registrar usuário:', error);
                }
              );
          })
          .catch(error => {
            // Trate os erros de requisição à API aqui (por exemplo, exibir mensagem de erro)
            console.error('Erro ao obter dados do CNPJ:', error);
          });
  
      } else {
        this.errorMessage = 'Senha fraca. Por favor, inclua pelo menos 8 caracteres, incluindo letras minúsculas, maiúsculas, números e caracteres especiais.';
      }
    }
  }
  

  LoginUser() {
    const form = document.getElementById('formLogin') as HTMLFormElement;
    const cnpj = form.elements.namedItem('cnpj') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    const loginData = {
      cnpj: cnpj.value,
      password: password.value
    };

    console.log(loginData)

    this.backendService.LoginUser(loginData)
      .subscribe(
        response => {
          // console.log('Usuário logado com sucesso:', response);
          const token = response.token;
          if (token) {
            localStorage.setItem('token', token);
            this.router.navigate(['/inventario']);
          } else {
            console.error('Token não encontrado na resposta.');
          }
        },
        error => {
          // Manipular erros de registro aqui (por exemplo, exibir mensagem de erro)
          console.error('Erro ao logar usuário:', error);
        }
      );
  }

  validarSenhaForte(senha: string): boolean {

    // Verificar comprimento da senha

    if (senha.length < 8) {

      return false; // Senha muito curta

    }

    // Verificar presença de dígitos, letras minúsculas, maiúsculas e caracteres especiais

    const possuiDigito = /[0-9]/.test(senha);

    const possuiMinuscula = /[a-z]/.test(senha);

    const possuiMaiuscula = /[A-Z]/.test(senha);

    const possuiEspecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha);

    // Contar o número de requisitos atendidos

    let requisitosAtendidos = 0;

    if (possuiDigito) requisitosAtendidos++;

    if (possuiMinuscula) requisitosAtendidos++;

    if (possuiMaiuscula) requisitosAtendidos++;

    if (possuiEspecial) requisitosAtendidos++;

    // Verificar se pelo menos três requisitos foram atendidos

    if (requisitosAtendidos < 3) {

      return false; // Não atende aos critérios mínimos

    }

    return true; // Senha forte

  }

}