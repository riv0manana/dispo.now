import { OpenAPIHono, createRoute } from 'npm:@hono/zod-openapi';
import { setCookie, getCookie } from 'hono/cookie';
import { z } from '@/app/zod.ts';
import { loadDeps } from '@/container/index.ts';

const users = new OpenAPIHono();

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string().optional()
});

const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email()
});

const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string()
});

const RefreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string()
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
    const uc = loadDeps('CreateUserUseCase');
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
    const uc = loadDeps('LoginUserUseCase');
    try {
      const result = await uc.execute(body);
      
      const isProduction = Deno.env.get("NODE_ENV") === "production";

      setCookie(c, 'access_token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        path: '/'
      });
      
      setCookie(c, 'refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        path: '/'
      });

      return c.json(result, 200);
    } catch (e: any) {
      if (e.message === 'InvalidCredentials') return c.json({ error: 'InvalidCredentials' }, 401);
      throw e;
    }
  }
);

users.openapi(
  createRoute({
    method: 'post',
    path: '/refresh',
    summary: 'Refresh Access Token',
    request: {
      body: {
        content: {
          'application/json': { schema: RefreshTokenSchema }
        }
      }
    },
    responses: {
      200: {
        content: { 'application/json': { schema: RefreshTokenResponseSchema } },
        description: 'Token refreshed'
      },
      401: { description: 'Invalid or expired refresh token' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json');
    let refreshToken = body.refreshToken;
    
    if (!refreshToken) {
      refreshToken = getCookie(c, 'refresh_token');
    }

    if (!refreshToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const uc = loadDeps('RefreshAccessTokenUseCase');
    try {
      const result = await uc.execute(refreshToken);
      
      const isProduction = Deno.env.get("NODE_ENV") === "production";
      
      setCookie(c, 'access_token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        path: '/'
      });
      
      setCookie(c, 'refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'Strict',
        path: '/'
      });

      return c.json(result, 200);
    } catch (e: any) {
      if (['InvalidRefreshToken', 'ExpiredRefreshToken', 'RevokedRefreshToken', 'UserNotFound'].includes(e.message)) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      throw e;
    }
  }
);

export { users };
