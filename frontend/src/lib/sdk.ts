import axios, { type AxiosInstance } from 'axios';
import { z } from 'zod';

// --- Types (Mirrored from Backend/OpenAPI) ---

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateProjectResponseSchema = ProjectSchema.extend({
  apiKey: z.string(),
});

export const BookingConfigSchema = z.object({
  daily: z.object({
    start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()
  }).optional(),
  weekly: z.object({
    availableDays: z.array(z.number().int().min(0).max(6)).optional()
  }).optional()
}).optional();

export const ResourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  defaultCapacity: z.number().int().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  bookingConfig: BookingConfigSchema
});

export const BookingSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  resourceId: z.string(),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  quantity: z.number().int().min(1),
  status: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CreateBookingRequestSchema = z.object({
  resourceId: z.string(),
  start: z.string(),
  end: z.string(),
  quantity: z.number().int().min(1),
  capacity: z.number().int().min(1).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for the Create Booking response (which is currently a subset of the full Booking)
export const CreateBookingResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
}).passthrough();

export const RecurrenceRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  interval: z.number().int().min(1).default(1),
  count: z.number().int().min(1).optional(),
  until: z.string().optional(),
  byWeekDays: z.array(z.number().int().min(0).max(6)).optional()
});

export const CreateRecurringBookingRequestSchema = z.object({
  resourceId: z.string(),
  start: z.string(),
  end: z.string(),
  quantity: z.number().int().min(1),
  recurrence: RecurrenceRuleSchema,
  metadata: z.record(z.string(), z.any()).optional(),
});


export const AvailabilitySlotSchema = z.object({
  start: z.string(),
  end: z.string(),
  available: z.number().int().min(0)
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

// --- Auth Options ---
export type AuthOptions = {
  apiKey?: string;
  projectId?: string;
};

// --- Client Class ---

class DispoClient {
  private api: AxiosInstance;
  private token: string | null = null;
  private onUnauthorizedCallback: (() => void) | null = null;

  constructor(baseURL: string = '') {
    const url = baseURL || import.meta.env.VITE_API_URL || ''; 
    
    this.api = axios.create({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });

    // Intercept 401s to trigger callback
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.logout();
          if (this.onUnauthorizedCallback) {
            this.onUnauthorizedCallback();
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from storage if available
    const storedToken = localStorage.getItem('dispo_token');
    if (storedToken) {
      this.setToken(storedToken);
    }
  }

  // --- Configuration ---

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  // --- Auth Management ---

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('dispo_token', token);
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('dispo_token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  isAuthenticated() {
    return !!this.token;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.setOnUnauthorized = handler;
  }

  private getAuthHeaders(auth: AuthOptions): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (auth.apiKey) {
      headers['x-api-key'] = auth.apiKey;
      if (!auth.projectId) {
         headers['Authorization'] = ''; 
      }
    }
    return headers;
  }

  // --- API Methods ---

  // Auth
  async register(email: string, password: string) {
    const res = await this.api.post('/api/users', { email, password });
    return UserSchema.parse(res.data);
  }

  async login(email: string, password: string) {
    const res = await this.api.post('/api/users/login', { email, password });
    const data = z.object({ token: z.string() }).parse(res.data);
    this.setToken(data.token);
    return data;
  }

  // Projects
  async createProject(name: string, metadata: Record<string, unknown> = {}) {
    const res = await this.api.post('/api/projects', { name, metadata });
    return CreateProjectResponseSchema.parse(res.data);
  }

  async getProjects() {
    const res = await this.api.get('/api/projects');
    return z.array(ProjectSchema).parse(res.data);
  }

  async updateProject(id: string, data: { name?: string; metadata?: unknown }) {
    const res = await this.api.patch(`/api/projects/${id}`, data);
    return ProjectSchema.parse(res.data);
  }

  async deleteProject(id: string) {
    const res = await this.api.delete(`/api/projects/${id}`);
    return res.data;
  }

  // Resources
  async createResource(
    auth: AuthOptions, 
    params: { 
      name: string; 
      defaultCapacity: number; 
      metadata?: unknown;
      bookingConfig?: z.infer<typeof BookingConfigSchema>
    }
  ) {
    const body = {
      ...params,
      ...(auth.projectId ? { projectId: auth.projectId } : {})
    };

    const res = await this.api.post('/api/resources', body, {
      headers: this.getAuthHeaders(auth)
    });
    return ResourceSchema.parse(res.data);
  }

  async getResources(auth: AuthOptions) {
    const params: Record<string, string> = {};
    if (auth.projectId) {
      params.projectId = auth.projectId;
    }

    const res = await this.api.get('/api/resources', {
      params,
      headers: this.getAuthHeaders(auth)
    });
    return z.array(ResourceSchema).parse(res.data);
  }

  async updateResource(
    id: string,
    params: {
      name?: string;
      defaultCapacity?: number;
      metadata?: unknown;
      bookingConfig?: z.infer<typeof BookingConfigSchema>
    },
    auth: AuthOptions
  ) {
    const queryParams: Record<string, string> = {};
    if (auth.projectId) {
      queryParams.projectId = auth.projectId;
    }

    const res = await this.api.patch(`/api/resources/${id}`, params, {
      params: queryParams,
      headers: this.getAuthHeaders(auth)
    });
    return ResourceSchema.parse(res.data);
  }

  async deleteResource(id: string, auth: AuthOptions) {
    const queryParams: Record<string, string> = {};
    if (auth.projectId) {
      queryParams.projectId = auth.projectId;
    }

    const res = await this.api.delete(`/api/resources/${id}`, {
      params: queryParams,
      headers: this.getAuthHeaders(auth)
    });
    return res.data;
  }

  // Bookings
  async createBooking(
    auth: AuthOptions, 
    params: z.infer<typeof CreateBookingRequestSchema>
  ) {
    const body = {
      ...params,
      ...(auth.projectId ? { projectId: auth.projectId } : {})
    };

    const res = await this.api.post('/api/bookings', body, {
      headers: this.getAuthHeaders(auth)
    });
    return CreateBookingResponseSchema.parse(res.data);
  }

  async getBookings(
    auth: AuthOptions, 
    resourceId: string, 
    start: string, 
    end: string
  ) {
    const params: Record<string, string> = { start, end };
    if (auth.projectId) {
      params.projectId = auth.projectId;
    }

    const res = await this.api.get(`/api/resources/${resourceId}/api/bookings`, {
      params,
      headers: this.getAuthHeaders(auth)
    });
    return z.array(BookingSchema).parse(res.data);
  }

  async getAvailability(
    auth: AuthOptions,
    resourceId: string,
    start: string,
    end: string,
    slotDurationMinutes: number = 60
  ) {
    const params: Record<string, string | number> = { start, end, slotDurationMinutes };
    if (auth.projectId) {
      params.projectId = auth.projectId;
    }

    const res = await this.api.get(`/api/resources/${resourceId}/availability`, {
      params,
      headers: this.getAuthHeaders(auth)
    });
    return z.array(AvailabilitySlotSchema).parse(res.data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createGroupBooking(data: { projectId: string, bookings: Array<{ resourceId: string, start: string, end: string, quantity: number, capacity?: number, metadata?: Record<string, any> }> }, options: AuthOptions = {}) {
    const authHeaders = this.getAuthHeaders(options);
    const response = await this.api.post('/api/bookings/group', data, {
      headers: authHeaders
    });
    return z.array(z.string()).parse(response.data);
  }

  async createRecurringBooking(
    auth: AuthOptions,
    params: z.infer<typeof CreateRecurringBookingRequestSchema>
  ) {
    const body = {
      ...params,
      ...(auth.projectId ? { projectId: auth.projectId } : {})
    };

    const res = await this.api.post('/api/bookings/recurring', body, {
      headers: this.getAuthHeaders(auth)
    });
    return z.array(z.string()).parse(res.data);
  }

  async cancelBooking(id: string, auth: AuthOptions) {
    const queryParams: Record<string, string> = {};
    if (auth.projectId) {
      queryParams.projectId = auth.projectId;
    }

    const res = await this.api.post(`/api/bookings/${id}/cancel`, {}, {
      params: queryParams,
      headers: this.getAuthHeaders(auth)
    });
    return res.data;
  }
}

export const client = new DispoClient();
