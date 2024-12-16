import { Component, OnInit } from '@angular/core';
import { WorkingHoursService, WorkingHour, TimeOff } from '../../../services/workingHours.service';

@Component({
  selector: 'app-schedule-config',
  templateUrl: './schedule-config.component.html',
  styleUrls: ['./schedule-config.component.scss'],
})
export class ScheduleConfigComponent implements OnInit {
  workingHours: (WorkingHour & { isActive: boolean })[] = [];
  timeOff: TimeOff[] = [];
  companyId: any; // Substitua pelo ID dinâmico da empresa
  isLoading: boolean = false;
  newTimeOff: TimeOff = { time_off_date: '', description: '', employee_id: 0 };


  constructor(
    private workingHoursService: WorkingHoursService,
  ) { }

  ngOnInit(): void {
    this.initializeWorkingHours();
    this.loadWorkingHours();
  }

  // Inicializa os 7 dias fixos
  initializeWorkingHours(): void {
    const daysOfWeek = [
      'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo', 'Feriado',
    ];
    this.workingHours = daysOfWeek.map((day) => ({
      day_of_week: day,
      start_time: '09:00:00',
      end_time: '18:00:00',
      isActive: true,
    }));
  }  

  loadWorkingHours(): void {
    this.isLoading = true;
    this.workingHoursService.getWorkingHours().subscribe(
      (data) => {
        this.workingHours.forEach((day) => {
          const apiDay = data.find((d) => d.day_of_week === day.day_of_week);
          if (apiDay) {
            day.start_time = apiDay.start_time;
            day.end_time = apiDay.end_time;
            day.isActive = true;
          } else {
            day.isActive = false;
          }
        });
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar horários de funcionamento:', error);
        this.isLoading = false;
      }
    );
  }

  // Salva os horários de funcionamento
  saveWorkingHours(): void {
    const activeHours = this.workingHours
      .filter((hour) => hour.isActive)
      .map(({ day_of_week, start_time, end_time }) => ({
        day_of_week,
        start_time,
        end_time,
      }));

    this.workingHoursService.saveWorkingHours(activeHours).subscribe(
      () => {
        console.log('Horários atualizados com sucesso!');
        alert('Horários salvos com sucesso!');
      },
      (error) => {
        console.error('Erro ao salvar horários:', error);
        alert('Erro ao salvar horários!');
      }
    );
  }
}
