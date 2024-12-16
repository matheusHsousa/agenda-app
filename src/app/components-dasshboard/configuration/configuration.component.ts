import { Component } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  // Aba ativa (por padrão, é a aba "Cores")
  activeTab: string = 'cores';

  // Lista de abas disponíveis
  tabs: { key: string; label: string }[] = [
    { key: 'cores', label: 'Configurar Cores' },
    { key: 'agenda', label: 'Configurar Agenda' },
    { key: 'feriados', label: 'Configurar feriados' },
    { key: 'usuarios', label: 'Configurar Usuários' },
  ];

  // Altera a aba ativa
  changeTab(tab: string): void {
    this.activeTab = tab;
  }
}
