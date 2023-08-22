import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller(`tests`)
export class AppController {
  // Service container injection
  constructor(private readonly appService: AppService) {}

  @Get(`test`)
  getHello(): string {
    return this.appService.getHello();
  }
}
