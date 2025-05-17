// User types
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    ORGANIZER = 'ORGANIZER'
}

// Event types
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    time: string;
    location: string;
    price: number;
    image: string;
    capacity: number;
    availableSeats: number;
    isFeatured: boolean;
    categoryId: string;
    organizerId: string;
    category?: Category;
    tags?: TagsOnEvents[];
    organizer?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface EventCreate {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    price: number;
    image: string;
    capacity: number;
    isFeatured?: boolean;
    categoryId: string;
    tagIds?: string[];
}

export interface EventUpdate {
    title?: string;
    description?: string;
    date?: Date;
    time?: string;
    location?: string;
    price?: number;
    image?: string;
    capacity?: number;
    availableSeats?: number;
    isFeatured?: boolean;
    categoryId?: string;
    tagIds?: string[];
}

// Category types
export interface Category {
    id: string;
    name: string;
    description: string;
    image?: string;
    events?: Event[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryCreate {
    name: string;
    description: string;
    image?: string;
}

export interface CategoryUpdate {
    name?: string;
    description?: string;
    image?: string;
}

// Tag types
export interface Tag {
    id: string;
    name: string;
    events?: TagsOnEvents[];
    createdAt?: string;
    updatedAt?: string;
}

export interface TagCreate {
    name: string;
}

export interface TagUpdate {
    name?: string;
}

// Booking types
export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    status: BookingStatus;
    tickets: number;
    totalPrice: number;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    user: User;
    event: Event;
    createdAt: string;
    updatedAt: string;
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    ATTENDED = 'ATTENDED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL',
    STRIPE = 'STRIPE',
    CASH = 'CASH'
}

export interface BookingCreate {
    eventId: string;
    tickets: number;
    paymentMethod: PaymentMethod;
}

export interface BookingUpdate {
    status?: BookingStatus;
    tickets?: number;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
}

// TagsOnEvents interface (for many-to-many relationship)
export interface TagsOnEvents {
    eventId: string;
    tagId: string;
    event?: Event;
    tag?: Tag;
    createdAt?: string;
} 