import { PasswordService } from '@/core/application/ports/PasswordService.ts';
import bcrypt from "npm:bcryptjs@^2.4.3";

export class BcryptPasswordService implements PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verify(password: string, hashStr: string): Promise<boolean> {
    return bcrypt.compare(password, hashStr);
  }
}
