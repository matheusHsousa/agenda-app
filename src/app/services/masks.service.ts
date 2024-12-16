import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasksService {

  constructor() { }

  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (cpf.length !== 11) return false; // Verifica se o CPF tem exatamente 11 dígitos

    // Verifica se todos os caracteres são iguais (ex.: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calcula e valida os dois dígitos verificadores
    const calcDigit = (cpf: string, length: number): number => {
      let sum = 0;
      let weight = length + 1;
      for (let i = 0; i < length; i++) {
        sum += parseInt(cpf.charAt(i)) * weight--;
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const digit1 = calcDigit(cpf, 9);
    const digit2 = calcDigit(cpf, 10);

    return cpf.charAt(9) === digit1.toString() && cpf.charAt(10) === digit2.toString();
  }

  applyCpfMask(cpf: string): string {
    cpf = cpf.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
  }
}
