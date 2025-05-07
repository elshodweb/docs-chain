import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'JWT_SECRET',
      useValue: JWT_SECRET,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
