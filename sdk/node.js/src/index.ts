import axios, { type AxiosInstance } from 'axios';
import { z } from 'zod';

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

// Schema for the Create Booking response
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

// --- Auth Options ---
export type DispoConfig = {
  baseURL?: string;
  apiKey?: string;
  bearerToken?: string;
};

export type RequestOptions = {
  apiKey?: string;
  projectId?: string;
};

// --- Client Class ---

export class DispoClient {
  private api: AxiosInstance;
  private config: DispoConfig;

  constructor(config: DispoConfig = {}) {
    this.config = config;
    const baseURL = config.baseURL || 'http://localhost:8000'; // Default to local, should be overridden in prod
    
    this.api = axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    if (this.config.bearerToken) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${this.config.bearerToken}`;
    }
  }

  private getAuthHeaders(options: RequestOptions = {}): Record<string, string> {
    const headers: Record<string, string> = {};
    const apiKey = options.apiKey || this.config.apiKey;

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    
    return headers;
  }

  // --- API Methods ---

  // Auth (Management)
  async register(email: string, password: string) {
    const res = await this.api.post('/api/users', { email, password });
    return UserSchema.parse(res.data);
  }

  async login(email: string, password: string) {
    const res = await this.api.post('/api/users/login', { email, password });
    const data = z.object({ token: z.string() }).parse(res.data);
    // Update client state if needed, though typically server-side SDKs are stateless or configured at init
    if (!this.config.bearerToken) {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  }

  // Projects (Management - Requires Bearer)
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

  // Resources (Runtime - Requires API Key)
  async createResource(
    params: { 
      name: string; 
      defaultCapacity: number; 
      metadata?: unknown;
      bookingConfig?: z.infer<typeof BookingConfigSchema>
    },
    options: RequestOptions = {}
  ) {
    const body = {
      ...params,
      ...(options.projectId ? { projectId: options.projectId } : {})
    };

    const res = await this.api.post('/api/resources', body, {
      headers: this.getAuthHeaders(options)
    });
    return ResourceSchema.parse(res.data);
  }

  async getResources(options: RequestOptions = {}) {
    const params: Record<string, string> = {};
    if (options.projectId) {
      params.projectId = options.projectId;
    }

    const res = await this.api.get('/api/resources', {
      params,
      headers: this.getAuthHeaders(options)
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
    options: RequestOptions = {}
  ) {
    const queryParams: Record<string, string> = {};
    if (options.projectId) {
      queryParams.projectId = options.projectId;
    }

    const res = await this.api.patch(`/api/resources/${id}`, params, {
      params: queryParams,
      headers: this.getAuthHeaders(options)
    });
    return ResourceSchema.parse(res.data);
  }

  async deleteResource(id: string, options: RequestOptions = {}) {
    const queryParams: Record<string, string> = {};
    if (options.projectId) {
      queryParams.projectId = options.projectId;
    }

    const res = await this.api.delete(`/api/resources/${id}`, {
      params: queryParams,
      headers: this.getAuthHeaders(options)
    });
    return res.data;
  }

  // Bookings (Runtime - Requires API Key)
  async createBooking(
    params: z.infer<typeof CreateBookingRequestSchema>,
    options: RequestOptions = {}
  ) {
    const body = {
      ...params,
      ...(options.projectId ? { projectId: options.projectId } : {})
    };

    const res = await this.api.post('/api/bookings', body, {
      headers: this.getAuthHeaders(options)
    });
    return CreateBookingResponseSchema.parse(res.data);
  }

  async getBookings(
    resourceId: string, 
    start: string, 
    end: string,
    options: RequestOptions = {}
  ) {
    const params: Record<string, string> = { start, end };
    if (options.projectId) {
      params.projectId = options.projectId;
    }

    const res = await this.api.get(`/api/resources/${resourceId}/api/bookings`, {
      params,
      headers: this.getAuthHeaders(options)
    });
    return z.array(BookingSchema).parse(res.data);
  }

  async getAvailability(
    resourceId: string,
    start: string,
    end: string,
    slotDurationMinutes: number = 60,
    options: RequestOptions = {}
  ) {
    const params: Record<string, string | number> = { start, end, slotDurationMinutes };
    if (options.projectId) {
      params.projectId = options.projectId;
    }

    const res = await this.api.get(`/api/resources/${resourceId}/availability`, {
      params,
      headers: this.getAuthHeaders(options)
    });
    return z.array(AvailabilitySlotSchema).parse(res.data);
  }

  async createGroupBooking(
    data: { 
      projectId: string, 
      bookings: Array<{ 
        resourceId: string, 
        start: string, 
        end: string, 
        quantity: number, 
        capacity?: number, 
        metadata?: Record<string, any> 
      }> 
    }, 
    options: RequestOptions = {}
  ) {
    const res = await this.api.post('/api/bookings/group', data, {
      headers: this.getAuthHeaders(options)
    });
    return z.array(z.string()).parse(res.data);
  }

  async createRecurringBooking(
    params: z.infer<typeof CreateRecurringBookingRequestSchema>,
    options: RequestOptions = {}
  ) {
    const body = {
      ...params,
      ...(options.projectId ? { projectId: options.projectId } : {})
    };

    const res = await this.api.post('/api/bookings/recurring', body, {
      headers: this.getAuthHeaders(options)
    });
    return z.array(z.string()).parse(res.data);
  }

  async cancelBooking(id: string, options: RequestOptions = {}) {
    const queryParams: Record<string, string> = {};
    if (options.projectId) {
      queryParams.projectId = options.projectId;
    }

    const res = await this.api.post(`/api/bookings/${id}/cancel`, {}, {
      params: queryParams,
      headers: this.getAuthHeaders(options)
    });
    return res.data;
  }
}

export default DispoClient;
