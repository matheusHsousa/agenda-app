import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  // Emitindo o evento para o AppComponent
  snackBarEmitter = new EventEmitter<any>();

  constructor() {}

  // Método para mostrar o Snackbar
  showSnackBar(message: string, color: string, icon: string, action: string): void {
    this.snackBarEmitter.emit({ message, color, icon, action });
  }
}
