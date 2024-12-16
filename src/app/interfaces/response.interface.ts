export interface ApiResponse {
    availableSlots: TimeSlot[];
}

// Definindo os tipos de TimeSlot
export interface TimeSlot {
    start_time: string;
    end_time: string;
}

