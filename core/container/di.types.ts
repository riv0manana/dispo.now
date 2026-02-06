// Ports (Repositories)
import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'
import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { BookingRepository } from '@/core/application/ports/BookingRepository.ts'
import { UserRepository } from '@/core/application/ports/UserRepository.ts'
import { RefreshTokenRepository } from '@/core/application/ports/RefreshTokenRepository.ts'

// Ports (Services)
import { PasswordService } from '@/core/application/ports/PasswordService.ts'
import { TokenService } from '@/core/application/ports/TokenService.ts'
import { TransactionManager } from '@/core/application/ports/TransactionManager.ts'
import { LockService } from '@/core/application/ports/LockService.ts'

// Ports (Generators)
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { ApiKeyGenerator } from '@/core/application/ports/ApiKeyGenerator.ts'

// Use Cases
import { CreateUserUseCase } from '@/core/application/usecases/CreateUserUseCase.ts'
import { LoginUserUseCase } from '@/core/application/usecases/LoginUserUseCase.ts'
import { RefreshAccessTokenUseCase } from '@/core/application/usecases/RefreshAccessTokenUseCase.ts'

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

export const SYMBOLS = {
  // Repositories
  ProjectRepository: Symbol.for('ProjectRepository'),
  ResourceRepository: Symbol.for('ResourceRepository'),
  BookingRepository: Symbol.for('BookingRepository'),
  UserRepository: Symbol.for('UserRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),

  // Services
  PasswordService: Symbol.for('PasswordService'),
  TokenService: Symbol.for('TokenService'),
  TransactionManager: Symbol.for('TransactionManager'),
  LockService: Symbol.for('LockService'),

  // Generators
  IdGenerator: Symbol.for('IdGenerator'),
  ApiKeyGenerator: Symbol.for('ApiKeyGenerator'),

  // Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  RefreshAccessTokenUseCase: Symbol.for('RefreshAccessTokenUseCase'),
  
  CreateProjectUseCase: Symbol.for('CreateProjectUseCase'),
  UpdateProjectUseCase: Symbol.for('UpdateProjectUseCase'),
  DeleteProjectUseCase: Symbol.for('DeleteProjectUseCase'),
  VerifyApiKeyUseCase: Symbol.for('VerifyApiKeyUseCase'),
  GetProjectsUseCase: Symbol.for('GetProjectsUseCase'),
  
  CreateResourceUseCase: Symbol.for('CreateResourceUseCase'),
  UpdateResourceUseCase: Symbol.for('UpdateResourceUseCase'),
  DeleteResourceUseCase: Symbol.for('DeleteResourceUseCase'),
  GetResourcesUseCase: Symbol.for('GetResourcesUseCase'),
  
  CreateBookingUseCase: Symbol.for('CreateBookingUseCase'),
  CreateGroupBookingUseCase: Symbol.for('CreateGroupBookingUseCase'),
  CreateRecurringBookingUseCase: Symbol.for('CreateRecurringBookingUseCase'),
  GetBookingsUseCase: Symbol.for('GetBookingsUseCase'),
  CancelBookingUseCase: Symbol.for('CancelBookingUseCase'),
  GetAvailabilityUseCase: Symbol.for('GetAvailabilityUseCase'),
} as const

export type DI_TYPES = {
  // Repositories
  ProjectRepository: ProjectRepository
  ResourceRepository: ResourceRepository
  BookingRepository: BookingRepository
  UserRepository: UserRepository
  RefreshTokenRepository: RefreshTokenRepository

  // Services
  PasswordService: PasswordService
  TokenService: TokenService
  TransactionManager: TransactionManager
  LockService: LockService

  // Generators
  IdGenerator: IdGenerator
  ApiKeyGenerator: ApiKeyGenerator

  // Use Cases
  CreateUserUseCase: CreateUserUseCase
  LoginUserUseCase: LoginUserUseCase
  RefreshAccessTokenUseCase: RefreshAccessTokenUseCase
  
  CreateProjectUseCase: CreateProjectUseCase
  UpdateProjectUseCase: UpdateProjectUseCase
  DeleteProjectUseCase: DeleteProjectUseCase
  VerifyApiKeyUseCase: VerifyApiKeyUseCase
  GetProjectsUseCase: GetProjectsUseCase
  
  CreateResourceUseCase: CreateResourceUseCase
  UpdateResourceUseCase: UpdateResourceUseCase
  DeleteResourceUseCase: DeleteResourceUseCase
  GetResourcesUseCase: GetResourcesUseCase
  
  CreateBookingUseCase: CreateBookingUseCase
  CreateGroupBookingUseCase: CreateGroupBookingUseCase
  CreateRecurringBookingUseCase: CreateRecurringBookingUseCase
  GetBookingsUseCase: GetBookingsUseCase
  CancelBookingUseCase: CancelBookingUseCase
  GetAvailabilityUseCase: GetAvailabilityUseCase
}
