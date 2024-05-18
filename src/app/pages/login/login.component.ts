import { Component, ElementRef, OnInit } from '@angular/core';
import { BackendService } from 'src/app/service/backend.service';
import { Router } from '@angular/router';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

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
  passwordInput: HTMLInputElement | null = null;
  constructor(private elementRef: ElementRef, private router: Router, private backendService: BackendService, private http: HttpClient) { }

  ngOnInit(): void {
    const passwordInput = document.getElementById('passwordreg') as HTMLInputElement;
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            this.validarSenhaForte(passwordInput.value);
        });
    }
    this.spanTexto = this.elementRef.nativeElement.querySelector('#organize')!;
    this.iniciarLoop();
    const textLogin: HTMLElement | null = document.getElementById('linkLogin');
    const textRegistro: HTMLElement | null = document.getElementById('linkRegister');
    const loginPage: HTMLElement | null = document.querySelector('.login');
    const registerPage: HTMLElement | null = document.querySelector('.register');
    const inputLogin: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('.input-login');
    this.passwordInput = document.getElementById('passwordreg') as HTMLInputElement;

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

  fazerLogin() {
    window.open('/senha', '_blank');
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

  async registerUser() {
    const form = document.getElementById('formRegister') as HTMLFormElement;
    if (!form) {
      console.error("Formulário não encontrado.");
      return;
    }

    const cnpj = form.elements.namedItem('cnpjreg') as HTMLInputElement | null;
    const email = form.elements.namedItem('email') as HTMLInputElement | null;
    const password = form.elements.namedItem('passwordreg') as HTMLInputElement | null;
    const reppassword = form.elements.namedItem('reppassword') as HTMLInputElement | null;

    if (!cnpj || !cnpj.value) {
      this.errorMessage = 'Por favor, informe um CNPJ.';
      return;
    } else if (!email || !email.value) {
      this.errorMessage = 'Por favor, informe um e-mail.';
      return;
    } else if (!this.validateEmail(email.value)) {
      console.error('E-mail inválido.');
      return;
    } else if (!password || !password.value) {
      this.errorMessage = 'Por favor, informe uma senha.';
      return;
    } else if (!reppassword || !reppassword.value) {
      this.errorMessage = 'Por favor, repita a senha correta';
      return;
    }

    const senha = password.value;

   

    this.errorMessage = '';

    if (await this.checkCNPJExists(cnpj.value)) {
        // Fazendo requisição à API do BrasilAPI para obter informações da empresa pelo CNPJ
        axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.value}`)
          .then(response => {
            const dadosCNPJ = response.data;

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
      this.errorMessage = 'Erro ao verificar CNPJ. Por favor, tente novamente mais tarde.';
    }
}



  // Função para validar a força da senha
  validarSenhaForte(senha: string): void {
    const progressElement = document.getElementById('passwordStrength');
    if (!progressElement) return;

    // Verificar a força da senha
    let strength = 0;

    // Adicionar pontos baseados em critérios de senha
    strength += senha.length >= 12 ? 1 : 0;
    strength += /[a-z]/.test(senha) ? 1 : 0; // Lowercase letters
    strength += /[A-Z]/.test(senha) ? 1 : 0; // Uppercase letters
    strength += /\d/.test(senha) ? 1 : 0;     // Digits
    strength += /[^A-Za-z0-9]/.test(senha) ? 1 : 0; // Special characters

    // Atualizar a largura da barra de progresso com base na força da senha
    const progressWidth = (strength / 5) * 100; // Assuming 5 points for maximum strength
    progressElement.style.width = progressWidth + '%';

    // Definir a cor da barra de progresso com base na força da senha
    if (progressWidth < 40) {
        progressElement.classList.remove('bg-warning', 'bg-success');
        progressElement.classList.add('bg-danger');
    } else if (progressWidth < 80) {
        progressElement.classList.remove('bg-danger', 'bg-success');
        progressElement.classList.add('bg-warning');
    } else {
        progressElement.classList.remove('bg-danger', 'bg-warning');
        progressElement.classList.add('bg-success');
    }
}


  // Function to validate CNPJ format (basic check, can be improved)
  validateCNPJ(cnpj: string): boolean {
    const cnpjLength = cnpj.length;
    return cnpjLength === 14 && /^[0-9]+$/.test(cnpj);
  }

  // Function to validate email format (basic check)
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async checkCNPJExists(cnpj: string): Promise<boolean> {
    try {
      const cnpjVerification = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      return !!cnpjVerification.data; // Convert response.data to boolean
    } catch (error) {
      console.error('Erro ao verificar CNPJ:', error);
      return false; // CNPJ not found or error occurred
    }
  }

}      
