import { OpenAPIHono, createRoute } from 'npm:@hono/zod-openapi';
import { z } from '@/app/zod.ts';
import { container } from '@/container/index.ts';
import { CreateUserUseCase } from '@/core/application/usecases/CreateUserUseCase.ts';
import { LoginUserUseCase } from '@/core/application/usecases/LoginUserUseCase.ts';

const users = new OpenAPIHono();

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email()
});

const LoginResponseSchema = z.object({
  token: z.string()
});

users.openapi(
  createRoute({
    method: 'post',
    path: '/',
    summary: 'Create Account',
    request: {
      body: {
        content: {
          'application/json': { schema: CreateUserSchema }
        }
      }
    },
    responses: {
      201: {
        content: { 'application/json': { schema: UserResponseSchema } },
        description: 'User created'
      },
      409: { description: 'User already exists' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json');
    const uc = container.get('CreateUserUseCase') as CreateUserUseCase;
    try {
      const result = await uc.execute(body);
      return c.json(result, 201);
    } catch (e: any) {
      if (e.message === 'UserAlreadyExists') return c.json({ error: 'UserAlreadyExists' }, 409);
      throw e;
    }
  }
);

users.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    summary: 'Login',
    request: {
      body: {
        content: {
          'application/json': { schema: LoginUserSchema }
        }
      }
    },
    responses: {
      200: {
        content: { 'application/json': { schema: LoginResponseSchema } },
        description: 'Login successful'
      },
      401: { description: 'Invalid credentials' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json');
    const uc = container.get('LoginUserUseCase') as LoginUserUseCase;
    try {
      const result = await uc.execute(body);
      return c.json(result, 200);
    } catch (e: any) {
      if (e.message === 'InvalidCredentials') return c.json({ error: 'InvalidCredentials' }, 401);
      throw e;
    }
  }
);

export { users };
