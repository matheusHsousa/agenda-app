import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-schedule-dash',
  templateUrl: './schedule-dash.component.html',
  styleUrls: ['./schedule-dash.component.scss']
})
export class ScheduleDashComponent implements OnInit {
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  employees: any[] = [];
  selectedEmployeeId: string = 'all';
  currentDate: Date = new Date(); // Data atual
  weekDates: Date[] = []; // Datas da semana atual
  currentWeekRange: string = ''; // Intervalo da semana atual


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchAllAppointments();
    this.calculateWeekDates(this.currentDate);
  }

  // Busca todos os funcionários
  fetchEmployees(): void {
    this.authService.getProfessionals().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => console.error('Erro ao buscar funcionários:', err),
    });
  }

  // Busca todos os agendamentos
  fetchAllAppointments(): void {
    this.authService.getAllSchedules().subscribe({
      next: (data) => {
        this.appointments = data.map((appt: any) => ({
          day: this.formatDay(new Date(appt.start_time)),
          time: this.formatTime(new Date(appt.start_time)),
          summary: appt.summary,
          employee_id: appt.employee_id,
          start_time: new Date(appt.start_time),
          end_time: new Date(appt.end_time),
          employee_name: appt.employee_name,
          status: appt.status,
        }));
        this.filterAppointments();
      },
      error: (err) => console.error('Erro ao buscar agendamentos:', err),
    });
  }

  // Calcula as datas da semana atual
  calculateWeekDates(startDate: Date): void {
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    this.weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    const startDateStr = this.formatDate(this.weekDates[0]);
    const endDateStr = this.formatDate(this.weekDates[6]);
    this.currentWeekRange = `${startDateStr} - ${endDateStr}`;
  }

  // Navegar para a semana anterior
  prevWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.calculateWeekDates(this.currentDate);
    this.filterAppointments();
  }

  // Navegar para a próxima semana
  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.calculateWeekDates(this.currentDate);
    this.filterAppointments();
  }

  // Atualiza as datas com base no dia selecionado
  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = new Date(inputElement.value);
    this.currentDate = selectedDate;
    this.calculateWeekDates(this.currentDate);
    this.filterAppointments();
  }

  // Filtra os agendamentos por funcionário e semana
  filterAppointments(): void {
    const startOfWeek = this.weekDates[0];
    const endOfWeek = this.weekDates[this.weekDates.length - 1];

    this.filteredAppointments = this.appointments.filter((appt) => {
      const isInSelectedWeek =
        appt.start_time >= startOfWeek && appt.start_time <= endOfWeek;
      const matchesEmployee =
        this.selectedEmployeeId === 'all' ||
        appt.employee_id === parseInt(this.selectedEmployeeId, 10);

      return isInSelectedWeek && matchesEmployee;
    });
  }

  // Atualiza o filtro por funcionário
  onEmployeeFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEmployeeId = selectElement.value;
    this.filterAppointments();
  }

  // Verifica se há agendamento no horário
  hasAppointment(day: string, time: string): boolean {
    return this.filteredAppointments.some((appt) => {
      const apptDay = this.formatDay(appt.start_time);
      const apptTime = this.formatTime(appt.start_time);
      return apptDay === day && apptTime === time;
    });
  }

  // Retorna o resumo do agendamento
  getAppointmentSummary(day: string, time: string): string {
    const appointment = this.filteredAppointments.find((appt) => {
      const apptDay = this.formatDay(appt.start_time);
      const apptTime = this.formatTime(appt.start_time);
      return apptDay === day && apptTime === time;
    });
    return appointment ? `${appointment.summary} - ${appointment.employee_name}` : '';
  }

  // Formata o nome do dia da semana
  formatDay(date: Date): string {
    return this.weekDays[date.getDay()];
  }

  // Formata o horário no formato HH:mm
  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Formata a data para YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Abre o modal para criar novo agendamento
  openSlot(day: string, time: string): void {
    alert(`Novo agendamento: ${day} às ${time}`);
  }
}
