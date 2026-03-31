import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admins.kd-realestate.la';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Types
export interface Project {
  id: string;
  tenantId: string;
  name: string;
  nameEn?: string;
  description?: string;
  location?: string;
  isActive: boolean;
  totalArea?: string;
  totalPlots?: number;
  basePricePerSqm?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plot {
  id: string;
  projectId: string;
  plotNumber: string;
  title?: string;
  status: 'available' | 'reserved' | 'booked' | 'sold' | 'pending_approval' | 'mortgaged' | 'disputed' | 'cancelled';
  areaSqm?: string;
  pricePerSqm?: string;
  totalPrice?: string;
  finalPrice?: string;
  direction?: string;
  plotType?: string;
  longitude?: string;
  latitude?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicBooking {
  id: string;
  bookingNumber: string;
  status: string;
  agreedPrice: string;
  depositAmount: string;
  depositMethod: string | null;
  createdAt: string;
  plotId: string | null;
  plotNumber: string | null;
  projectName: string | null;
  projectLocation: string | null;
}

export interface CreateBookingPayload {
  plotId: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  agreedPrice: number;
  depositAmount: number;
  depositMethod?: string;
}

// API Calls
export const publicApi = {
  // Get all active projects
  getProjects: async () => {
    const response = await api.get<Project[]>('/public/projects');
    return response.data;
  },

  // Get all available plots with filters
  getPlots: async (filters?: {
    projectId?: string;
    page?: number;
    limit?: number;
    priceMin?: number;
    priceMax?: number;
    sizeMin?: number;
    sizeMax?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Plot>>('/public/plots', { params: filters });
    return response.data;
  },

  // Get single plot details
  getPlot: async (id: string) => {
    const response = await api.get<Plot>(`/public/plots/${id}`);
    return response.data;
  },

  // Create booking
  createBooking: async (payload: CreateBookingPayload) => {
    const response = await api.post('/public/booking', payload);
    return response.data;
  },

  // Look up customer's own bookings (cookie-based auth via otpSession)
  getMyBookings: async () => {
    const response = await api.get<PublicBooking[]>('/public/my-bookings');
    return response.data;
  },
};

export default api;
