// This file contains only type definitions and interfaces
// Database operations are handled in API routes at runtime

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    max_participants: number;
    current_participants: number;
    created_at: string;
    updated_at: string;
}

export interface EventParticipant {
    id: string;
    event_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

// Note: Database operations have been moved to API routes to avoid build-time imports
// This file is now safe for static builds and only contains type definitions
