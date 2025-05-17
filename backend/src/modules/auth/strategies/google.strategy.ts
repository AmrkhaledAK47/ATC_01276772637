import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:3000/api/auth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      console.log('Google profile:', JSON.stringify(profile, null, 2));

      // Extract primary email from Google profile
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        console.error('Google auth: No email available in profile');
        return done(new Error('Unable to retrieve email from Google profile. Please ensure you grant email permission.'), null);
      }

      // Extract avatar from Google profile
      let avatar = null;
      if (profile.photos && profile.photos.length > 0) {
        avatar = profile.photos[0].value;
      } else if (profile._json && profile._json.picture) {
        avatar = profile._json.picture;
      }

      // Use the authService to find or create the user
      const user = await this.authService.validateOrCreateSocialUser({
        email,
        name: profile.displayName || profile.name?.givenName || profile.name?.familyName || email.split('@')[0],
        provider: 'google',
        providerId: profile.id,
        avatar,
      });

      // Log successful Google authentication
      console.log(`Google authentication successful for user: ${email}`);

      return done(null, user);
    } catch (error) {
      console.error('Google authentication error:', error);
      // Provide a more descriptive error message
      const errorMessage = error.message || 'Google authentication failed. Please try again.';
      return done(new Error(errorMessage), null);
    }
  }
} 