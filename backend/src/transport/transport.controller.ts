import { Controller, Get } from '@nestjs/common';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  // GET /transport/intercity
  // Şehir dışı hatlar (public)
  @Get('intercity')
  async findIntercity() {
    return this.transportService.findIntercity();
  }

  // GET /transport/intracity
  // Şehir içi rotalar (public)
  @Get('intracity')
  async findIntracity() {
    return this.transportService.findIntracity();
  }
}
