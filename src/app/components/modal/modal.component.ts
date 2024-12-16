import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../services/employee.service';
import { ServicesService } from '../../services/services.service';
import { ApiResponse } from 'src/app/interfaces/response.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: number | null = null;
  selectedDate: string = '';
  availableSlots: { start_time: string; end_time: string }[] = [];
  startSlots: string[] = []; // Horários de início
  endSlots: string[] = []; // Horários de fim
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  isDateSelected: boolean = false;
  minDate: string = '';

  // Campos para serviço e descrição
  services: any[] = []; // Lista de serviços do funcionário
  selectedService: number | null = null; // Serviço selecionado
  selectedDescription: string = ''; // Descrição do serviço selecionado

  constructor(
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.setMinDate();
  }

  loadEmployees() {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error('Erro ao carregar funcionários:', err);
      },
    });
  }

  setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  checkAvailability() {
    if (this.selectedEmployee && this.selectedDate) {
      this.employeesService
        .getEmployeeSchedule(this.selectedEmployee, this.selectedDate)
        .subscribe({
          next: (response: ApiResponse) => {
            this.availableSlots = response.availableSlots;
            this.generateSplitSlots();
          },
          error: (err) => {
            console.error('Erro ao buscar disponibilidade:', err);
          },
        });
    }
  }

  onDateChange() {
    if (this.selectedEmployee) {
      this.isDateSelected = true;
      this.checkAvailability();

      // Aguarda até que o campo de horário esteja disponível
      setTimeout(() => {
        const startTimeInput = document.getElementById('start-time');
        if (startTimeInput) {
          startTimeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300); // Tempo para garantir que o elemento esteja no DOM
    } else {
      alert('Por favor, selecione um funcionário primeiro.');
    }
  }

  generateSplitSlots() {
    this.startSlots = [];
    this.endSlots = [];

    for (const slot of this.availableSlots) {
      const start = new Date(this.parseDate(slot.start_time));
      const end = new Date(this.parseDate(slot.end_time));

      let current = new Date(start);
      while (current < end) {
        const timeString = current.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Adiciona a `startSlots`
        this.startSlots.push(timeString);

        current.setMinutes(current.getMinutes() + 10);
      }

      // O último horário disponível para o fim do intervalo
      this.endSlots.push(end.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }));
    }
  }

  parseDate(dateString: string): string {
    const [day, month, year] = dateString.split(',')[0].split('/');
    const time = dateString.split(',')[1]?.trim() || '00:00:00';
    return `${year}-${month}-${day}T${time}`;
  }

  scheduleAppointment() {
    const selectedStartIndex = this.startSlots.indexOf(this.selectedStartTime);

    if (selectedStartIndex === -1) {
      alert('Selecione um horário de início válido.');
      return;
    }

    const selectedSlot = this.availableSlots.find(slot => {
      const start = new Date(this.parseDate(slot.start_time)).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const end = new Date(this.parseDate(slot.end_time)).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return this.selectedStartTime >= start && this.selectedStartTime < end;
    });

    if (!selectedSlot) {
      console.error('Erro: Nenhum intervalo correspondente encontrado.');
      return;
    }

    const start = new Date(this.parseDate(selectedSlot.start_time));
    const end = new Date(this.parseDate(selectedSlot.end_time));
    const availableEndTimes: string[] = [];

    let current = new Date(start);
    current.setHours(parseInt(this.selectedStartTime.split(':')[0]), parseInt(this.selectedStartTime.split(':')[1]), 0);

    while (current < end) {
      current.setMinutes(current.getMinutes() + 10);
      if (current <= end) {
        availableEndTimes.push(current.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }));
      }
    }

    this.updateEndTimeOptions(availableEndTimes);

    this.selectedEndTime = availableEndTimes.length > 0 ? availableEndTimes[0] : '';
  }

  updateEndTimeOptions(availableEndTimes: string[]) {
    const endSelectElement = document.getElementById('end-time') as HTMLSelectElement;
    if (endSelectElement) {
      while (endSelectElement.firstChild) {
        endSelectElement.removeChild(endSelectElement.firstChild);
      }

      availableEndTimes.forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        endSelectElement.appendChild(opt);
      });

      if (availableEndTimes.length > 0) {
        this.selectedEndTime = availableEndTimes[0];
      }
    }
  }

  confirmAppointment() {
    if (!this.selectedStartTime || !this.selectedEndTime) {
      alert('Por favor, selecione um horário de início e fim.');
      return;
    }

    console.log(`Agendamento confirmado: ${this.selectedStartTime} - ${this.selectedEndTime}`);
    alert(`Agendamento confirmado: ${this.selectedStartTime} - ${this.selectedEndTime}`);
  }

  onEmployeeChange() {
    this.selectedDate = '';
    this.availableSlots = [];
    this.startSlots = [];
    this.endSlots = [];
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.isDateSelected = false;
    this.selectedService = null;
    this.selectedDescription = '';
    this.services = [];

    if (this.selectedEmployee) {
      this.loadServicesForEmployee(this.selectedEmployee);
    }
  }

  loadServicesForEmployee(employeeId: number) {
    this.servicesService.getServicesForEmployee(employeeId).subscribe({
      next: (services) => {
        if (services.length > 0) {
          this.services = services;
        } else {
          this.services = [];
          console.warn('Nenhum serviço encontrado para o funcionário.');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
        this.services = [];
      },
    });
  }  

  onServiceChange() {
    const selectedServiceObj = this.services.find(service => service.id === this.selectedService);
    this.selectedDescription = selectedServiceObj ? selectedServiceObj.description : '';
  }
}
