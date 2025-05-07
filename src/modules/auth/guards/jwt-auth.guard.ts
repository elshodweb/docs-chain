import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('Auth Header:', authHeader); // Debug log

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Guard - Error:', err); // Debug log
    console.log('JWT Guard - Info:', info); // Debug log
    console.log('JWT Guard - User:', user); // Debug log

    if (err) {
      throw new UnauthorizedException(err.message || 'Invalid token');
    }

    if (!user) {
      throw new UnauthorizedException('User not found in token');
    }

    return user;
  }
}
