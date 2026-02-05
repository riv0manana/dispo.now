export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'dispo.now - Headless Self-Hosted Booking Engine',
    version: '1.0.1-beta.1'
  },
  servers: [
    {
      url: '/'
    }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key'
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' }
        },
        required: ['id', 'email']
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        },
        required: ['email', 'password']
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        },
        required: ['email', 'password']
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        },
        required: ['token']
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          metadata: { type: 'object', additionalProperties: true }
        },
        required: ['id', 'name', 'metadata']
      },
      CreateProjectRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          metadata: { type: 'object', additionalProperties: true }
        },
        required: ['name']
      },
      UpdateProjectRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          metadata: { type: 'object', additionalProperties: true }
        }
      },
      CreateProjectResponse: {
        allOf: [
          { $ref: '#/components/schemas/Project' },
          {
            type: 'object',
            properties: {
              apiKey: { type: 'string' }
            },
            required: ['apiKey']
          }
        ]
      },
      Resource: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          projectId: { type: 'string' },
          name: { type: 'string' },
          defaultCapacity: { type: 'integer', minimum: 1 },
          metadata: { type: 'object', additionalProperties: true },
          bookingConfig: {
            type: 'object',
            properties: {
              daily: {
                type: 'object',
                properties: {
                  start: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
                  end: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
                }
              },
              weekly: {
                type: 'object',
                properties: {
                  availableDays: {
                    type: 'array',
                    items: { type: 'integer', minimum: 0, maximum: 6 }
                  }
                }
              }
            }
          }
        },
        required: ['id', 'projectId', 'name', 'defaultCapacity', 'metadata']
      },
      CreateResourceRequest: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          name: { type: 'string' },
          defaultCapacity: { type: 'integer', minimum: 1 },
          metadata: { type: 'object', additionalProperties: true },
          bookingConfig: {
            type: 'object',
            properties: {
              daily: {
                type: 'object',
                properties: {
                  start: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
                  end: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
                }
              },
              weekly: {
                type: 'object',
                properties: {
                  availableDays: {
                    type: 'array',
                    items: { type: 'integer', minimum: 0, maximum: 6 }
                  }
                }
              }
            }
          }
        },
        required: ['name', 'defaultCapacity']
      },
      UpdateResourceRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          defaultCapacity: { type: 'integer', minimum: 1 },
          metadata: { type: 'object', additionalProperties: true },
          bookingConfig: {
            type: 'object',
            properties: {
              daily: {
                type: 'object',
                properties: {
                  start: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
                  end: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
                }
              },
              weekly: {
                type: 'object',
                properties: {
                  availableDays: {
                    type: 'array',
                    items: { type: 'integer', minimum: 0, maximum: 6 }
                  }
                }
              }
            }
          }
        }
      },
      BookingCreateRequest: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          resourceId: { type: 'string' },
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
          quantity: { type: 'integer', minimum: 1 },
          capacity: { type: 'integer', minimum: 1 },
          metadata: { type: 'object', additionalProperties: true }
        },
        required: ['resourceId', 'start', 'end', 'quantity']
      },
      GroupBookingCreateRequest: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          bookings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                resourceId: { type: 'string' },
                start: { type: 'string', format: 'date-time' },
                end: { type: 'string', format: 'date-time' },
                quantity: { type: 'integer', minimum: 1 },
                capacity: { type: 'integer', minimum: 1 },
                metadata: { type: 'object', additionalProperties: true }
              },
              required: ['resourceId', 'start', 'end', 'quantity']
            }
          }
        },
        required: ['bookings']
      },
      CreateRecurringBookingRequest: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          resourceId: { type: 'string' },
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
          quantity: { type: 'integer', minimum: 1 },
          recurrence: {
            type: 'object',
            properties: {
              frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
              interval: { type: 'integer', minimum: 1, default: 1 },
              count: { type: 'integer', minimum: 1 },
              until: { type: 'string', format: 'date-time' },
              byWeekDays: {
                type: 'array',
                items: { type: 'integer', minimum: 0, maximum: 6 }
              }
            },
            required: ['frequency']
          },
          metadata: { type: 'object', additionalProperties: true }
        },
        required: ['resourceId', 'start', 'end', 'quantity', 'recurrence']
      },
      BookingResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string' },
          timeRange: {
            type: 'object',
            properties: {
              start: { type: 'string', format: 'date-time' },
              end: { type: 'string', format: 'date-time' }
            },
            required: ['start', 'end']
          }
        },
        required: ['id', 'status', 'timeRange']
      },
      BookingListItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          resourceId: { type: 'string' },
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
          status: { type: 'string' }
        },
        required: ['id', 'resourceId', 'start', 'end', 'status']
      },
      AvailabilitySlot: {
        type: 'object',
        properties: {
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
          available: { type: 'integer', minimum: 0 }
        },
        required: ['start', 'end', 'available']
      }
    }
  },
  paths: {
    '/resources/{id}/availability': {
      get: {
        summary: 'Get Availability Slots',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'start', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } },
          { name: 'end', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } },
          { name: 'slotDurationMinutes', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 60 } }
        ],
        responses: {
          200: {
            description: 'List of available slots',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AvailabilitySlot' } } } }
          }
        }
      }
    },
    '/users': {
      post: {
        summary: 'Create Account',
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } }
          }
        },
        responses: {
          201: {
            description: 'User created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          }
        }
      }
    },
    '/users/login': {
      post: {
        summary: 'Login',
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } }
          }
        }
      }
    },
    '/projects': {
      post: {
        summary: 'Create Project',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateProjectRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Project created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProjectResponse' } } }
          }
        }
      },
      get: {
        summary: 'List Projects',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of projects',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } }
          }
        }
      }
    },
    '/projects/{id}': {
      patch: {
        summary: 'Update Project',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateProjectRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Project updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } }
          }
        }
      },
      delete: {
        summary: 'Delete Project',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Project deleted',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, id: { type: 'string' } } } } }
          }
        }
      }
    },
    '/resources': {
      post: {
        summary: 'Create Resource',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateResourceRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Resource created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } }
          }
        }
      }
    },
    '/resources/{id}': {
      patch: {
        summary: 'Update Resource',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateResourceRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Resource updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } }
          }
        }
      },
      delete: {
        summary: 'Delete Resource',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Resource deleted',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, id: { type: 'string' } } } } }
          }
        }
      }
    },
    '/bookings': {
      post: {
        summary: 'Create Booking',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/BookingCreateRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Booking created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/BookingResponse' } } }
          }
        }
      }
    },
    '/bookings/group': {
      post: {
        summary: 'Create Group Booking',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/GroupBookingCreateRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Group Booking created',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } }
          }
        }
      }
    },
    '/bookings/recurring': {
      post: {
        summary: 'Create Recurring Booking',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateRecurringBookingRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Recurring Bookings created',
            content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } }
          }
        }
      }
    }
  }
}
