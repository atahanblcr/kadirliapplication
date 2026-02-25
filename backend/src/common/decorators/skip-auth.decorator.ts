import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuth';

/**
 * Skip JWT authentication and role checking for a specific route
 * Used for public endpoints that don't require authentication
 */
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
