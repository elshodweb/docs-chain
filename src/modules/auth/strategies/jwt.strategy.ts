import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UsersService } from '../../user/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    @Inject('JWT_SECRET') private readonly jwtSecret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT Payload:', payload); // Debug log
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userData = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      console.log('User data from JWT:', userData); // Debug log
      return userData;
    } catch (error) {
      console.error('JWT Validation Error:', error); // Debug log
      throw new UnauthorizedException('Invalid token');
    }
  }
}
