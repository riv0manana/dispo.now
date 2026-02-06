import { createContainer } from 'ioctopus'
import { SYMBOLS, DI_TYPES } from './di.types.ts'

// Use Cases
import { CreateProjectUseCase } from '@/core/application/usecases/CreateProjectUseCase.ts'
import { UpdateProjectUseCase } from '@/core/application/usecases/UpdateProjectUseCase.ts'
import { DeleteProjectUseCase } from '@/core/application/usecases/DeleteProjectUseCase.ts'
import { VerifyApiKeyUseCase } from '@/core/application/usecases/VerifyApiKeyUseCase.ts'
import { GetProjectsUseCase } from '@/core/application/usecases/GetProjectsUseCase.ts'
import { CreateResourceUseCase } from '@/core/application/usecases/CreateResourceUseCase.ts'
import { UpdateResourceUseCase } from '@/core/application/usecases/UpdateResourceUseCase.ts'
import { DeleteResourceUseCase } from '@/core/application/usecases/DeleteResourceUseCase.ts'
import { GetResourcesUseCase } from '@/core/application/usecases/GetResourcesUseCase.ts'
import { CreateBookingUseCase } from '@/core/application/usecases/CreateBookingUseCase.ts'
import { CreateGroupBookingUseCase } from '@/core/application/usecases/CreateGroupBookingUseCase.ts'
import { CreateRecurringBookingUseCase } from '@/core/application/usecases/CreateRecurringBookingUseCase.ts'
import { GetBookingsUseCase } from '@/core/application/usecases/GetBookingsUseCase.ts'
import { CancelBookingUseCase } from '@/core/application/usecases/CancelBookingUseCase.ts'
import { GetAvailabilityUseCase } from '@/core/application/usecases/GetAvailabilityUseCase.ts'
import { CreateUserUseCase } from '@/core/application/usecases/CreateUserUseCase.ts'
import { LoginUserUseCase } from '@/core/application/usecases/LoginUserUseCase.ts'
import { RefreshAccessTokenUseCase } from '@/core/application/usecases/RefreshAccessTokenUseCase.ts'

// Infrastructure (Fakes for Testability/Core Focus)
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'
import { FakeRefreshTokenRepository } from '@/core/tests/fakes/FakeRefreshTokenRepository.ts'
import { FakePasswordService } from '@/core/tests/fakes/FakePasswordService.ts'
import { FakeTokenService } from '@/core/tests/fakes/FakeTokenService.ts'
import { FakeTransactionManager } from '@/core/tests/fakes/FakeTransactionManager.ts'
import { FakeLockService } from '@/core/tests/fakes/FakeLockService.ts'

// Infrastructure (Real)
import { DrizzleProjectRepository } from '@/infra/repositories/DrizzleProjectRepository.ts';
import { DrizzleResourceRepository } from '@/infra/repositories/DrizzleResourceRepository.ts';
import { DrizzleBookingRepository } from '@/infra/repositories/DrizzleBookingRepository.ts';
import { DrizzleUserRepository } from '@/infra/repositories/DrizzleUserRepository.ts';
import { DrizzleRefreshTokenRepository } from '@/infra/repositories/DrizzleRefreshTokenRepository.ts';
import { BcryptPasswordService } from '@/infra/services/BcryptPasswordService.ts';
import { HonoJwtTokenService } from '@/infra/services/HonoJwtTokenService.ts';
import { DrizzleTransactionManager } from '@/infra/services/DrizzleTransactionManager.ts';
import { DrizzleLockService } from '@/infra/services/DrizzleLockService.ts';

const container = createContainer()

const env = Deno.env.get('NODE_ENV') || 'development';
const isTest = env === 'test';

// 1. Singletons (Repositories & Services)
if (isTest) {
  container.bind(SYMBOLS.ProjectRepository).toValue(new FakeProjectRepository())
  container.bind(SYMBOLS.ResourceRepository).toValue(new FakeResourceRepository())
  container.bind(SYMBOLS.BookingRepository).toValue(new FakeBookingRepository())
  container.bind(SYMBOLS.UserRepository).toValue(new FakeUserRepository())
  container.bind(SYMBOLS.RefreshTokenRepository).toValue(new FakeRefreshTokenRepository())
  container.bind(SYMBOLS.PasswordService).toValue(new FakePasswordService())
  container.bind(SYMBOLS.TokenService).toValue(new FakeTokenService())
  container.bind(SYMBOLS.TransactionManager).toValue(new FakeTransactionManager())
  container.bind(SYMBOLS.LockService).toValue(new FakeLockService())
} else {
  container.bind(SYMBOLS.ProjectRepository).toValue(new DrizzleProjectRepository())
  container.bind(SYMBOLS.ResourceRepository).toValue(new DrizzleResourceRepository())
  container.bind(SYMBOLS.BookingRepository).toValue(new DrizzleBookingRepository())
  container.bind(SYMBOLS.UserRepository).toValue(new DrizzleUserRepository())
  container.bind(SYMBOLS.RefreshTokenRepository).toValue(new DrizzleRefreshTokenRepository())
  container.bind(SYMBOLS.PasswordService).toValue(new BcryptPasswordService())
  container.bind(SYMBOLS.TokenService).toValue(new HonoJwtTokenService())
  container.bind(SYMBOLS.TransactionManager).toValue(new DrizzleTransactionManager())
  container.bind(SYMBOLS.LockService).toValue(new DrizzleLockService())
}

// 2. Ports (Generators)
container.bind(SYMBOLS.IdGenerator).toValue({ generate: () => crypto.randomUUID() })
container.bind(SYMBOLS.ApiKeyGenerator).toValue({ generate: () => `sk_live_${crypto.randomUUID().replace(/-/g, '')}` })

// 3. Use Cases
container.bind(SYMBOLS.CreateUserUseCase).toClass(CreateUserUseCase, [
  SYMBOLS.UserRepository,
  SYMBOLS.IdGenerator,
  SYMBOLS.PasswordService
])

container.bind(SYMBOLS.LoginUserUseCase).toClass(LoginUserUseCase, [
  SYMBOLS.UserRepository,
  SYMBOLS.PasswordService,
  SYMBOLS.TokenService,
  SYMBOLS.RefreshTokenRepository,
  SYMBOLS.IdGenerator
])

container.bind(SYMBOLS.RefreshAccessTokenUseCase).toClass(RefreshAccessTokenUseCase, [
  SYMBOLS.TokenService,
  SYMBOLS.RefreshTokenRepository,
  SYMBOLS.UserRepository,
  SYMBOLS.IdGenerator
])

container.bind(SYMBOLS.CreateProjectUseCase).toClass(CreateProjectUseCase, [
  SYMBOLS.ProjectRepository,
  SYMBOLS.IdGenerator,
  SYMBOLS.ApiKeyGenerator
])

container.bind(SYMBOLS.UpdateProjectUseCase).toClass(UpdateProjectUseCase, [
  SYMBOLS.ProjectRepository
])

container.bind(SYMBOLS.DeleteProjectUseCase).toClass(DeleteProjectUseCase, [
  SYMBOLS.ProjectRepository
])

container.bind(SYMBOLS.VerifyApiKeyUseCase).toClass(VerifyApiKeyUseCase, [
  SYMBOLS.ProjectRepository
])

container.bind(SYMBOLS.GetProjectsUseCase).toClass(GetProjectsUseCase, [
  SYMBOLS.ProjectRepository
])

container.bind(SYMBOLS.CreateResourceUseCase).toClass(CreateResourceUseCase, [
  SYMBOLS.ResourceRepository,
  SYMBOLS.ProjectRepository,
  SYMBOLS.IdGenerator
])

container.bind(SYMBOLS.UpdateResourceUseCase).toClass(UpdateResourceUseCase, [
  SYMBOLS.ResourceRepository
])

container.bind(SYMBOLS.DeleteResourceUseCase).toClass(DeleteResourceUseCase, [
  SYMBOLS.ResourceRepository
])

container.bind(SYMBOLS.GetResourcesUseCase).toClass(GetResourcesUseCase, [
  SYMBOLS.ResourceRepository
])

container.bind(SYMBOLS.CreateBookingUseCase).toClass(CreateBookingUseCase, [
  SYMBOLS.BookingRepository,
  SYMBOLS.ResourceRepository,
  SYMBOLS.IdGenerator,
  SYMBOLS.TransactionManager,
  SYMBOLS.LockService
])

container.bind(SYMBOLS.CreateGroupBookingUseCase).toClass(CreateGroupBookingUseCase, [
  SYMBOLS.BookingRepository,
  SYMBOLS.ResourceRepository,
  SYMBOLS.IdGenerator
])

container.bind(SYMBOLS.CreateRecurringBookingUseCase).toClass(CreateRecurringBookingUseCase, [
  SYMBOLS.BookingRepository,
  SYMBOLS.ResourceRepository,
  SYMBOLS.IdGenerator
])

container.bind(SYMBOLS.GetBookingsUseCase).toClass(GetBookingsUseCase, [
  SYMBOLS.BookingRepository,
  SYMBOLS.ResourceRepository
])

container.bind(SYMBOLS.CancelBookingUseCase).toClass(CancelBookingUseCase, [
  SYMBOLS.BookingRepository
])

container.bind(SYMBOLS.GetAvailabilityUseCase).toClass(GetAvailabilityUseCase, [
  SYMBOLS.ResourceRepository,
  SYMBOLS.BookingRepository
])

export function loadDeps<K extends keyof typeof SYMBOLS & keyof DI_TYPES>(symbol: K): DI_TYPES[K] {
  return container.get(SYMBOLS[symbol]);
}

export { container }
