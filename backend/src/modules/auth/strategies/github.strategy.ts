import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'passport-oauth2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL', 'http://localhost:3000/api/auth/github/callback'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      console.log('GitHub profile:', JSON.stringify(profile, null, 2));

      // Extract primary email from GitHub profile
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        console.error('GitHub auth: No email available in profile');
        return done(new Error('Unable to retrieve email from GitHub profile. Please ensure your email is public in GitHub settings.'), null);
      }

      // Extract avatar from GitHub profile
      let avatar = null;
      if (profile.photos && profile.photos.length > 0) {
        avatar = profile.photos[0].value;
      } else if (profile._json && profile._json.avatar_url) {
        avatar = profile._json.avatar_url;
      }

      // Use the authService to find or create the user
      const user = await this.authService.validateOrCreateSocialUser({
        email,
        name: profile.displayName || profile.username || email.split('@')[0],
        provider: 'github',
        providerId: profile.id,
        avatar,
      });

      // Log successful GitHub authentication
      console.log(`GitHub authentication successful for user: ${email}`);

      return done(null, user);
    } catch (error) {
      console.error('GitHub authentication error:', error);
      // Provide a more descriptive error message
      const errorMessage = error.message || 'GitHub authentication failed. Please try again.';
      return done(new Error(errorMessage), null);
    }
  }
} 