# SKILL: API Security

**Amaç:** Güvenli API yazmak için best practices

---

## 🔐 Authentication

```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
```

---

## 🛡️ Input Validation

```typescript
// Always validate input
@Post()
async create(@Body() dto: CreateAdDto) {
  // DTO validation otomatik (class-validator)
  return this.service.create(dto);
}

// Sanitize user input
import { sanitize } from 'class-sanitizer';

@IsString()
@Transform(({ value }) => sanitize(value))
description: string;
```

---

## 🚦 Rate Limiting

```typescript
// Global rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  }),
);

// Custom rate limiting per endpoint
@UseGuards(RateLimitGuard)
@Post('request-otp')
async requestOTP() {
  // 10 requests per hour
}
```

---

## 🔒 SQL Injection Prevention

```typescript
// ✅ SAFE: Query builder
.where('user.id = :id', { id: userId })

// ❌ DANGEROUS: Raw query
.where(`user.id = ${userId}`) // DON'T DO THIS!
```

---

## 🛡️ XSS Prevention

```typescript
// Sanitize HTML
import * as sanitizeHtml from 'sanitize-html';

@Transform(({ value }) => sanitizeHtml(value, { allowedTags: [] }))
description: string;
```

---

**KULLAN:** API endpoint'i yazmadan önce bu skill'i oku!
