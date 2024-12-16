export enum ResetLevels {
    POSITION = 'position',
    SERVICE = 'service',
    EMPLOYEE = 'employee',
    RESET_ALL = 'resetAll',
  }
  
  export enum Warnings {
    RED_DAY_NO_AVAILABILITY = 'Dia marcado como "red" e sem gaps. Nenhum horário disponível.',
    NO_GAPS_FALLBACK = 'Nenhum gap encontrado. Usando expediente completo como fallback.',
    INVALID_INTERVAL = 'Intervalo inválido ou sem gaps. Usando expediente completo.',
    NO_START_TIME = 'Selecione horários de início e término válidos.',
  }
  
  export enum Logs {
    ALL_DATA_RESET = 'Todos os dados foram resetados.',
    AVAILABLE_TIMES_FULL_DAY = 'Horários disponíveis para o expediente completo:',
  }
  