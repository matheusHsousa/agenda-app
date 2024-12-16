import { Component, OnInit } from '@angular/core';
import { Holiday, WorkingHoursService } from 'src/app/services/workingHours.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {
  newHoliday: Holiday = { holiday_date: '', description: '' };
  holidays: (Holiday & { isEditing?: boolean })[] = [];
  isLoading: boolean = false;

  constructor(private workingHoursService: WorkingHoursService) { }

  ngOnInit(): void {
    this.loadHolidays();
  }

  // Carrega os feriados
  loadHolidays(): void {
    this.isLoading = true;
    this.workingHoursService.getHolidays().subscribe(
      (data) => {
        this.holidays = data.map((holiday) => ({
          ...holiday,
          holiday_date: this.formatDate(holiday.holiday_date), // Converte a data
          isEditing: false,
        }));
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar feriados:', error);
        this.isLoading = false;
      }
    );
  }

  // Converte data ISO para formato YYYY-MM-DD
  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // Adiciona um novo feriado
  addHoliday(): void {
    if (this.holidays.some((h) => h.holiday_date === this.newHoliday.holiday_date)) {
      alert('Já existe um feriado cadastrado para esta data.');
      return;
    }

    if (this.newHoliday.holiday_date && this.newHoliday.description) {
      this.workingHoursService.saveHolidays([this.newHoliday]).subscribe(
        (response) => {
          this.holidays.push({ ...response[0], isEditing: false });
          this.newHoliday = { holiday_date: '', description: '' };
          this.loadHolidays()
          console.log('Feriado adicionado com sucesso!');
        },
        (error) => {
          console.error('Erro ao adicionar feriado:', error);
          alert('Erro ao adicionar feriado!');
        }
      );
    } else {
      alert('Preencha todos os campos para adicionar um feriado.');
    }
  }

  // Salvar edição de feriado
  saveEdit(holiday: Holiday): void {
    if (holiday.id) {
      this.workingHoursService.updateHoliday(holiday).subscribe(
        () => {
          holiday.isEditing = false;
          console.log('Feriado atualizado com sucesso!');
        },
        (error) => {
          console.error('Erro ao atualizar feriado:', error);
          alert('Erro ao atualizar feriado!');
        }
      );
    }
  }

  // Exclui um feriado
  deleteHoliday(id: number | undefined): void {
    if (id) {
      this.workingHoursService.deleteHoliday(id).subscribe(
        () => {
          this.holidays = this.holidays.filter((holiday) => holiday.id !== id);
          console.log('Feriado excluído com sucesso!');
        },
        (error) => {
          console.error('Erro ao excluir feriado:', error);
          alert('Erro ao excluir feriado!');
        }
      );
    }
  }
}
