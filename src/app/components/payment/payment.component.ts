import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { MasksService } from 'src/app/services/masks.service';
import { NgForm } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})

export class PaymentComponent implements OnInit {
  paymentMethods: any[] = []; 
  plans: any[] = []; 
  paymentMethod: string | null = null; 
  cart: any = {}; 
  showPaymentMethod: boolean = false; 
  showPaymentForm: boolean = false; 
  installments: number = 1; 
  paymentData: any = {
    payer: {
      first_name: '',
      last_name: '',
      email: '',
      identification: {
        type: 'CPF',
        number: '',
      },
    },
    card: {
      holder_name: '',
      number: '',
      expiration: '',
      security_code: '',
    },
    installments: 1, // Número padrão de parcelas
  };

  interval: any;

  constructor(
    private paymentService: PaymentService,
    private masksServices: MasksService,
    private snackbarService: SnackbarService, 
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
    this.loadPlans();
    this.showSnackBar('Mensagem de sucesso!', 'success', 'check_circle', 'Fechar');
    if (this.paymentMethod === 'pix' && this.cart.qrCode) {
      this.startPixStatusPolling();
    }
  }

  ngOnDestroy(): void {
    this.stopPixStatusPolling(); 
  }

  startPixStatusPolling(): void {
    this.interval = setInterval(() => {
      this.checkPixPaymentStatus();
    }, 10000); // Consulta o status do Pix a cada 10 segundos
  }

  stopPixStatusPolling(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  checkPixPaymentStatus(): void {
    if (!this.cart.qrCode) return; // Se não houver QR Code, não consulta

    this.paymentService.getPixPaymentStatus(this.cart.qrCode).subscribe(
      (response: any) => {
        if (response.status === 'approved') {
          this.stopPixStatusPolling(); // Para de consultar o status
          this.showSnackBar('Pagamento Pix confirmado!', 'Sucesso', 'green', 'check_circle');
          this.router.navigate(['/dashboard']); // Redireciona para o dashboard
        }
      },
      (error: any) => {
        console.error('Erro ao verificar o status do pagamento Pix:', error);
        this.showSnackBar('Erro ao verificar o status do pagamento. Tente novamente.', 'Erro', 'red', 'error');
      }
    );
  }

  confirmPixPayment(): void {
    this.router.navigate(['/dashboard']);
  }

  loadPaymentMethods(): void {
    this.paymentService.getPaymentMethods().subscribe(
      (methods: any[]) => {
        this.paymentMethods = methods;
      },
      (error: any) => {
        console.error('Erro ao carregar métodos de pagamento:', error);
        this.showSnackBar('Erro ao carregar métodos de pagamento.', 'Erro', 'red', 'error');
      }
    );
  }

  loadPlans(): void {
    this.paymentService.getPlans().subscribe(
      (plans: any[]) => {
        this.plans = plans;
      },
      (error: any) => {
        console.error('Erro ao carregar planos:', error);
        this.showSnackBar('Erro ao carregar planos.', 'Erro', 'red', 'error');
      }
    );
  }

  addToCart(plan: string, price: number, frequency: string): void {
    this.cart = { plan, price, frequency };
    this.showPaymentMethod = true;
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;

    if (method === 'pix' || method === 'boleto') {
      // Inicia pagamento para Pix ou Boleto diretamente
      this.processNonCardPayment();
    } else if (method === 'card') {
      // Exibe o formulário de cartão
      this.showPaymentForm = true;
    }
  }

  processNonCardPayment(): void {
    const paymentData: any = {
      amount: this.cart.price,
      description: this.cart.plan,
      paymentMethod: this.paymentMethod,
    };

    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        if (this.paymentMethod === 'pix') {
          this.cart.qrCodeBase64 = response.qr_code_base64;
          this.cart.qrCode = response.qr_code;
          this.showSnackBar('Pagamento iniciado via Pix. Escaneie o QR Code.', 'Sucesso', 'green', 'check_circle');
        } else if (this.paymentMethod === 'boleto') {
          this.cart.boletoUrl = response.boleto_url;
          this.showSnackBar('Boleto gerado. Acesse o link para realizar o pagamento.', 'Sucesso', 'green', 'check_circle');
        }
      },
      (error) => {
        console.error('Erro ao processar pagamento:', error);
        this.showSnackBar('Erro ao processar pagamento. Verifique os dados e tente novamente.', 'Erro', 'red', 'error');
      }
    );
  }

  pay(form: NgForm): void {
    if (!form.valid) {
      this.showSnackBar('Por favor, preencha todos os campos corretamente.', 'Erro', 'red', 'error');
      return;
    }

    if (this.paymentMethod !== 'card') {
      this.showSnackBar('O método de pagamento selecionado não é válido para este processo.', 'Erro', 'red', 'error');
      return;
    }

    const [expiration_month, expiration_year] = this.paymentData.card.expiration
      .split('/')
      .map((part: string) => part.trim());
    if (!expiration_month || !expiration_year) {
      this.showSnackBar('Data de expiração inválida. Use o formato MM/AA.', 'Erro', 'red', 'error');
      return;
    }

    const paymentData: any = {
      amount: this.cart.price,
      description: this.cart.plan,
      paymentMethod: this.paymentData.card.brand,
      payer: {
        first_name: this.paymentData.payer.first_name,
        last_name: this.paymentData.payer.last_name,
        email: this.paymentData.payer.email,
        identification: {
          type: 'CPF',
          number: this.paymentData.payer.identification.number,
        },
        card: {
          holder_name: this.paymentData.card.holder_name,
          number: this.paymentData.card.number.trim(),
          expiration_month,
          expiration_year: `20${expiration_year}`,
          security_code: this.paymentData.card.security_code,
        },
      },
      installments: this.paymentData.installments || 1,
    };

    this.paymentService.createSubscription(paymentData).subscribe(
      (response) => {
        this.showSnackBar(`Pagamento aprovado! Status: ${response.paymentStatus}`, 'Sucesso', 'green', 'check_circle');
        this.router.navigate(['/dashboard']);
      },
      (error) => {        
        const errorMessage = error.error?.error || 'Erro desconhecido ao processar pagamento.';
        this.showSnackBar(errorMessage, 'Erro', 'red', 'error');
      }
    );
    
  }

  validateCardBrand(): void {
    const bin = this.paymentData.card.number?.substring(0, 6);

    if (!bin || bin.length < 6) {
      this.showSnackBar('Por favor, insira os 6 primeiros dígitos do cartão para identificar a bandeira.', 'Erro', 'red', 'error');
      return;
    }

    this.paymentService.validateCardBrand(bin).subscribe(
      (response) => {
        this.paymentData.card.brand = response.brand;
        console.log(`Bandeira detectada pelo backend: ${response.brand}`);
      },
      (error) => {
        console.error('Erro ao validar a bandeira do cartão:', error);
        this.showSnackBar('Erro ao validar a bandeira do cartão. Verifique os dados e tente novamente.', 'Erro', 'red', 'error');
      }
    );
  }

  showSnackBar(message: string, action: string, color: string, icon: string): void {
    this.snackbarService.showSnackBar(message, color, icon, action);
  }
  
  getIcon(icon: string): string {
    return `<mat-icon>${icon}</mat-icon>`;
  }

  validateCVV(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
      this.paymentData.card.security_code = input.value;
    }
  }

  goBack(): void {
    if (this.showPaymentForm) {
      this.showPaymentForm = false;
    } else if (this.showPaymentMethod) {
      this.showPaymentMethod = false;
      this.paymentMethod = null;
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.showSnackBar('Chave Pix copiada para a área de transferência!', 'Sucesso', 'green', 'check_circle');
      },
      () => {
        this.showSnackBar('Erro ao copiar a chave Pix.', 'Erro', 'red', 'error');
      }
    );
  }

  onCardNumberBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cardNumber = input.value.replace(/\s+/g, ''); 
    this.paymentData.card.number = cardNumber; 
    if (cardNumber.length >= 6) {
      this.validateCardBrand();
    } else {
      console.warn('Número do cartão incompleto. Insira pelo menos 6 dígitos.');
    }
  }  

  onCpfInputChange(): void {
    const rawCpf = this.paymentData.payer.identification.number.replace(/\D/g, '');  // Remove qualquer caractere não numérico
    const formattedCpf = this.masksServices.applyCpfMask(rawCpf);  // Aplica a máscara ao CPF
    
    // Atualiza o modelo do campo para forçar a validação
    this.paymentData.payer.identification.number = formattedCpf;
  }
  
  onCpfBlur(): void {
    const rawCpf = this.paymentData.payer.identification.number.replace(/\D/g, '');  // Remove caracteres não numéricos
    if (!this.masksServices.validateCpf(rawCpf)) {
      this.showSnackBar("CPF inválido.", 'Erro', 'red', 'error');
    }
  }  

  formatExpiration(value: string) {
    let formattedValue = value.replace(/\D/g, '');
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.substring(0, 4);
    }
    if (formattedValue.length >= 3) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
    }
    this.paymentData.card.expiration = formattedValue;
  }

  
}
