import { Component } from '@angular/core';
import { CompanyColors } from 'src/app/models/conpany-colors.model';
import { CompanyColorsService } from 'src/app/services/company-colors.service';

@Component({
  selector: 'app-company-colors',
  templateUrl: './company-colors.component.html',
  styleUrls: ['./company-colors.component.scss']
})
export class CompanyColorsComponent {
  colors: CompanyColors = {
    primary_color: '#2c3e50',
    secondary_color: '#ecf0f1',
    text_color: '#000000',
    background_color: '#ffffff',
    highlight_color: '#a3a3a3',
    danger_color: '#7e2121',
  };

  // Lista de chaves que serão exibidas no formulário
  colorKeys: string[] = [
    'primary_color',
    'secondary_color',
    'text_color',
    'background_color',
    'highlight_color',
    'danger_color',
  ];

  constructor(private companyColorsService: CompanyColorsService) { }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.companyColorsService.getColors().subscribe(
      (response: CompanyColors) => {
        this.colors = response;
        this.updateCSSVariables(response);
      },
      (error: any) => {
        console.error('Erro ao carregar as cores:', error);
      }
    );
  }

  saveColors(): void {
    this.companyColorsService.saveColors(this.colors).subscribe(
      (response: any) => {
        console.log('Cores salvas com sucesso:', response);
        alert('Cores atualizadas com sucesso!');
        this.updateCSSVariables(this.colors);
      },
      (error: any) => {
        console.error('Erro ao salvar as cores:', error);
        alert('Erro ao salvar as cores.');
      }
    );
  }

  deleteColors(): void {
    if (confirm('Tem certeza de que deseja remover as cores da empresa?')) {
      this.companyColorsService.deleteColors().subscribe(
        (response: any) => {
          console.log('Cores removidas com sucesso:', response);
          alert('Cores removidas com sucesso!');
          this.resetColorsToDefault();
        },
        (error: any) => {
          console.error('Erro ao remover as cores:', error);
          alert('Erro ao remover as cores.');
        }
      );
    }
  }

  updateCSSVariables(colors: CompanyColors): void {
    const root = document.querySelector(':root') as HTMLElement;

    if (!root) {
      console.error('Elemento :root não encontrado!');
      return;
    }

    // Atualiza as variáveis CSS no :root
    Object.keys(colors).forEach((key) => {
      const cssVariableName = `--${key.replace('_', '-')}`; // Converte para o formato esperado no CSS
      root.style.setProperty(cssVariableName, colors[key as keyof CompanyColors]);
    });

    console.log('Variáveis CSS atualizadas:', colors);
  }


  resetColorsToDefault(): void {
    const defaultColors: CompanyColors = {
      primary_color: '#2c3e50',
      secondary_color: '#ecf0f1',
      text_color: '#000000',
      background_color: '#ffffff',
      highlight_color: '#a3a3a3',
      danger_color: '#7e2121',
    };
    this.colors = { ...defaultColors };
    this.updateCSSVariables(defaultColors);
  }
}
