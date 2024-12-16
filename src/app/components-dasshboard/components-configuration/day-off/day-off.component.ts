import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employee.service';
import { TimeOff, WorkingHoursService } from 'src/app/services/workingHours.service';

@Component({
  selector: 'app-day-off',
  templateUrl: './day-off.component.html',
  styleUrls: ['./day-off.component.scss'],
})
export class DayOffComponent implements OnInit {
  employees: any[] = [];
  timeOffTypes: any[] = [];  // Lista de tipos de folga
  newTimeOff: TimeOff = {
    time_off_date: '',
    time_off_end_date: '',
    description: '',
    employee_id: 0,
    type_id: null,
  };

  timeOff: (TimeOff & { isEditing?: boolean, type_name?: string })[] = [];

  constructor(
    private workingHoursService: WorkingHoursService,
    private employeeService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.loadTimeOff();
    this.loadEmployees();
    this.loadTimeOffTypes();  // Carregar tipos de folga ao inicializar
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
      },
      (error: any) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    );
  }

  loadTimeOffTypes(): void {
    this.workingHoursService.getTimeOffTypes().subscribe(
      (data: any[]) => {
        this.timeOffTypes = data;  // Armazenar tipos de folga no componente
      },
      (error: any) => {
        console.error('Erro ao carregar tipos de folga:', error);
      }
    );
  }

  loadTimeOff(): void {
    this.workingHoursService.getTimeOff().subscribe(
      (data: TimeOff[]) => {
        this.timeOff = data.map((off) => ({
          ...off,
          time_off_date: this.formatDate(off.time_off_date),
          time_off_end_date: off.time_off_end_date ? this.formatDate(off.time_off_end_date) : '',
          isEditing: false,
        }));
      },
      (error) => {
        console.error('Erro ao carregar folgas programadas:', error);
      }
    );
  }

  addTimeOff(): void {
    if (this.newTimeOff.time_off_date && this.newTimeOff.description && this.newTimeOff.employee_id && this.newTimeOff.type_id) {
      const { ...timeOffData } = this.newTimeOff;
      this.workingHoursService.saveTimeOff([timeOffData]).subscribe(
        (response) => {
          this.timeOff.push({ ...response[0], isEditing: false });
          this.newTimeOff = { time_off_date: '', time_off_end_date: '', description: '', employee_id: 0, type_id: null };
          this.loadTimeOff();
          console.log('Folga adicionada com sucesso!');
        },
        (error) => {
          console.error('Erro ao adicionar folga:', error);
          alert('Erro ao adicionar folga.');
        }
      );
    } else {
      alert('Preencha todos os campos obrigatórios: Data, Funcionário, Descrição e Tipo de Folga.');
    }
  }

  // Função para salvar a edição de uma folga
  saveEdit(off: TimeOff): void {
    if (off.id) {
      this.workingHoursService.updateTimeOff(off).subscribe(
        () => {
          off.isEditing = false;
          console.log('Folga atualizada com sucesso!');
        },
        (error) => {
          console.error('Erro ao atualizar folga:', error);
          alert('Erro ao atualizar folga.');
        }
      );
    }
  }

  // Função para excluir uma folga
  deleteTimeOff(id: number | undefined): void {
    if (id) {
      this.workingHoursService.deleteTimeOff(id).subscribe(
        () => {
          this.timeOff = this.timeOff.filter((off) => off.id !== id);
          console.log('Folga excluída com sucesso!');
        },
        (error) => {
          console.error('Erro ao excluir folga:', error);
          alert('Erro ao excluir folga.');
        }
      );
    }
  }

  // Função auxiliar para formatar a data
  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
