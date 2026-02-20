# SKILL: NestJS Backend Development

**Amaç:** NestJS ile professional backend yazma best practices

---

## 📦 Module Structure

```typescript
// Her modül şu yapıda:
src/
└── moduleName/
    ├── moduleName.module.ts
    ├── moduleName.service.ts
    ├── moduleName.controller.ts
    ├── dto/
    │   ├── create-moduleName.dto.ts
    │   └── update-moduleName.dto.ts
    ├── entities/
    │   └── moduleName.entity.ts
    └── moduleName.service.spec.ts
```

---

## 🎯 Service Layer Pattern

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  // ✅ DOĞRU: Async/await, tip güvenli
  async findById(id: string): Promise<User> {
    const cached = await this.redisService.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['neighborhood'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.redisService.set(`user:${id}`, JSON.stringify(user), 3600);
    return user;
  }

  // ✅ Transaction kullanımı
  async createAd(userId: string, data: CreateAdDto): Promise<Ad> {
    return this.userRepository.manager.transaction(async (manager) => {
      const ad = manager.create(Ad, { ...data, userId });
      await manager.save(ad);

      await manager.increment(User, { id: userId }, 'ads_count', 1);

      return ad;
    });
  }
}
```

---

## 🛡️ Validation & DTO

```typescript
// DTO with validation
export class CreateAdDto {
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(2000)
  @Matches(/^[^<>]*$/, { message: 'HTML tags not allowed' })
  description: string;

  @IsNumber()
  @Min(1)
  @Max(999999999)
  price: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  image_ids: string[];
}
```

---

## 🎮 Controller Best Practices

```typescript
@Controller('ads')
@UseGuards(JwtAuthGuard)
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  @Public() // Custom decorator for public routes
  async findAll(@Query() query: FindAdsDto) {
    return this.adsService.findAll(query);
  }

  @Post()
  @UseGuards(RateLimitGuard) // Rate limiting
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: User,
    @Body() createAdDto: CreateAdDto,
  ) {
    return this.adsService.create(user.id, createAdDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() updateAdDto: UpdateAdDto,
  ) {
    return this.adsService.update(id, user.id, updateAdDto);
  }
}
```

---

## 🔐 Guards & Decorators

```typescript
// JWT Auth Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// Roles Guard
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Custom Decorator
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

---

## 🚦 Error Handling

```typescript
// Custom exceptions
export class AdNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Ad with ID ${id} not found`);
  }
}

// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      error: {
        code: exception?.name || 'INTERNAL_ERROR',
        message: exception?.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

---

## 📊 Database Optimization

```typescript
// N+1 problem çözümü
async findAdsWithImages(): Promise<Ad[]> {
  return this.adRepository.find({
    relations: ['images', 'category', 'user'], // Eager load
    where: { status: 'approved' },
    order: { created_at: 'DESC' },
  });
}

// Query builder ile complex query
async findAdsWithFilters(filters: FindAdsDto): Promise<[Ad[], number]> {
  const query = this.adRepository
    .createQueryBuilder('ad')
    .leftJoinAndSelect('ad.images', 'images')
    .leftJoinAndSelect('ad.category', 'category')
    .where('ad.status = :status', { status: 'approved' })
    .andWhere('ad.expires_at > :now', { now: new Date() });

  if (filters.category_id) {
    query.andWhere('ad.category_id = :categoryId', {
      categoryId: filters.category_id,
    });
  }

  if (filters.min_price) {
    query.andWhere('ad.price >= :minPrice', { minPrice: filters.min_price });
  }

  if (filters.search) {
    query.andWhere(
      `to_tsvector('turkish', ad.title || ' ' || ad.description) @@ plainto_tsquery('turkish', :search)`,
      { search: filters.search },
    );
  }

  return query
    .skip((filters.page - 1) * filters.limit)
    .take(filters.limit)
    .getManyAndCount();
}
```

---

## ⏰ Background Jobs (Bull)

```typescript
// Queue processor
@Processor('announcements')
export class AnnouncementsProcessor {
  @Process('send-push-notifications')
  async handleSendPush(job: Job<SendPushData>) {
    const { announcementId, userIds } = job.data;

    // Process in batches of 500
    const batches = chunk(userIds, 500);

    for (const batch of batches) {
      await this.fcmService.sendBatch(batch, announcementId);
      await job.progress(batches.indexOf(batch) / batches.length * 100);
    }

    return { sent: userIds.length };
  }
}

// Queue producer
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectQueue('announcements')
    private announcementsQueue: Queue,
  ) {}

  async sendAnnouncement(id: string) {
    const userIds = await this.getTargetUserIds(id);

    await this.announcementsQueue.add('send-push-notifications', {
      announcementId: id,
      userIds,
    });
  }
}
```

---

## 🧪 Testing

```typescript
describe('AdsService', () => {
  let service: AdsService;
  let repository: MockType<Repository<Ad>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdsService,
        {
          provide: getRepositoryToken(Ad),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(AdsService);
    repository = module.get(getRepositoryToken(Ad));
  });

  describe('create', () => {
    it('should create ad with 7-day expiration', async () => {
      const dto = { title: 'Test', price: 1000 };
      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + 7);

      repository.save.mockResolvedValue({
        id: 'uuid',
        ...dto,
        expires_at: expectedExpiry,
      });

      const result = await service.create('user-id', dto);

      expect(result.expires_at).toBeCloseTo(expectedExpiry.getTime(), -10000);
    });
  });
});
```

---

**KULLAN:** Her NestJS kodu yazmadan önce bu skill'i oku!
