import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bootstrap-snackbar',
  templateUrl: './bootstrap-snackbar.component.html',
  styleUrls: ['./bootstrap-snackbar.component.scss']
})
export class BootstrapSnackbarComponent implements OnInit, OnChanges {
  @Input() message: string = '';
  @Input() action: string = '';
  @Input() color: string = '';  // Recebe o tipo de cor (success, error, etc.)
  @Input() icon: string = '';
  
  show: boolean = false;
  
  // Variáveis para armazenar as cores do toast
  toastColor: string = '';    // Cor do fundo
  toastTextColor: string = ''; // Cor do texto

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']) {  // Corrigido para acessar 'color' com a notação de índice
      this.updateColors(changes['color'].currentValue);
    }
  }

  // Função para atualizar as cores conforme o tipo de mensagem
  private updateColors(color: string): void {
    switch(color) {
      case 'success':
        this.toastColor = '#28a745';  // Verde para sucesso
        this.toastTextColor = 'white'; // Texto branco
        break;
      case 'error':
        this.toastColor = '#dc3545';  // Vermelho para erro
        this.toastTextColor = 'white'; // Texto branco
        break;
      case 'warning':
        this.toastColor = '#ffc107';  // Amarelo para aviso
        this.toastTextColor = 'black'; // Texto preto
        break;
      case 'info':
        this.toastColor = '#17a2b8';  // Azul para info
        this.toastTextColor = 'white'; // Texto branco
        break;
      default:
        this.toastColor = '#6c757d';  // Cinza padrão
        this.toastTextColor = 'white'; // Texto branco
        break;
    }

  }

  showSnackbar(message: string, color: string, icon: string, action: string): void {
    this.message = message;
    this.icon = icon;
    this.action = action;
    this.show = true;

    this.toastColor = color || '#6c757d';  // Se não passar cor, usamos cinza como fallback
    this.toastTextColor = 'white'; // Cor do texto sempre branca
  
  
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
  
}
