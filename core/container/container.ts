import { createContainer } from 'ioctopus'

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

// Infrastructure (Fakes for Testability/Core Focus)
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeBookingRepository } from '@/core/tests/fakes/FakeBookingRepository.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'
import { FakePasswordService } from '@/core/tests/fakes/FakePasswordService.ts'
import { FakeTokenService } from '@/core/tests/fakes/FakeTokenService.ts'

// Infrastructure (Real)
import { DrizzleProjectRepository } from '@/infra/repositories/DrizzleProjectRepository.ts';
import { DrizzleResourceRepository } from '@/infra/repositories/DrizzleResourceRepository.ts';
import { DrizzleBookingRepository } from '@/infra/repositories/DrizzleBookingRepository.ts';
import { DrizzleUserRepository } from '@/infra/repositories/DrizzleUserRepository.ts';
import { BcryptPasswordService } from '@/infra/services/BcryptPasswordService.ts';
import { HonoJwtTokenService } from '@/infra/services/HonoJwtTokenService.ts';

const container = createContainer()

const env = Deno.env.get('NODE_ENV') || 'development';
const isTest = env === 'test';

// 1. Singletons (Repositories & Services)
if (isTest) {
  container.bind('ProjectRepository').toValue(new FakeProjectRepository())
  container.bind('ResourceRepository').toValue(new FakeResourceRepository())
  container.bind('BookingRepository').toValue(new FakeBookingRepository())
  container.bind('UserRepository').toValue(new FakeUserRepository())
  container.bind('PasswordService').toValue(new FakePasswordService())
  container.bind('TokenService').toValue(new FakeTokenService())
} else {
  container.bind('ProjectRepository').toValue(new DrizzleProjectRepository())
  container.bind('ResourceRepository').toValue(new DrizzleResourceRepository())
  container.bind('BookingRepository').toValue(new DrizzleBookingRepository())
  container.bind('UserRepository').toValue(new DrizzleUserRepository())
  container.bind('PasswordService').toValue(new BcryptPasswordService())
  container.bind('TokenService').toValue(new HonoJwtTokenService())
}

// 2. Ports (Generators)
container.bind('IdGenerator').toValue({ generate: () => crypto.randomUUID() })
container.bind('ApiKeyGenerator').toValue({ generate: () => `sk_live_${crypto.randomUUID().replace(/-/g, '')}` })

// 3. Use Cases
container.bind('CreateUserUseCase').toClass(CreateUserUseCase, [
  'UserRepository',
  'IdGenerator',
  'PasswordService'
])

container.bind('LoginUserUseCase').toClass(LoginUserUseCase, [
  'UserRepository',
  'PasswordService',
  'TokenService'
])

container.bind('CreateProjectUseCase').toClass(CreateProjectUseCase, [
  'ProjectRepository',
  'IdGenerator',
  'ApiKeyGenerator'
])

container.bind('UpdateProjectUseCase').toClass(UpdateProjectUseCase, [
  'ProjectRepository'
])

container.bind('DeleteProjectUseCase').toClass(DeleteProjectUseCase, [
  'ProjectRepository'
])

container.bind('VerifyApiKeyUseCase').toClass(VerifyApiKeyUseCase, [
  'ProjectRepository'
])

container.bind('GetProjectsUseCase').toClass(GetProjectsUseCase, [
  'ProjectRepository'
])

container.bind('CreateResourceUseCase').toClass(CreateResourceUseCase, [
  'ResourceRepository',
  'ProjectRepository',
  'IdGenerator'
])

container.bind('UpdateResourceUseCase').toClass(UpdateResourceUseCase, [
  'ResourceRepository'
])

container.bind('DeleteResourceUseCase').toClass(DeleteResourceUseCase, [
  'ResourceRepository'
])

container.bind('GetResourcesUseCase').toClass(GetResourcesUseCase, [
  'ResourceRepository'
])

container.bind('CreateBookingUseCase').toClass(CreateBookingUseCase, [
  'BookingRepository',
  'ResourceRepository',
  'IdGenerator'
])

container.bind('CreateGroupBookingUseCase').toClass(CreateGroupBookingUseCase, [
  'BookingRepository',
  'ResourceRepository',
  'IdGenerator'
])

container.bind('CreateRecurringBookingUseCase').toClass(CreateRecurringBookingUseCase, [
  'BookingRepository',
  'ResourceRepository',
  'IdGenerator'
])

container.bind('GetBookingsUseCase').toClass(GetBookingsUseCase, [
  'BookingRepository',
  'ResourceRepository'
])

container.bind('CancelBookingUseCase').toClass(CancelBookingUseCase, [
  'BookingRepository'
])

container.bind('GetAvailabilityUseCase').toClass(GetAvailabilityUseCase, [
  'ResourceRepository',
  'BookingRepository'
])


export { container }
