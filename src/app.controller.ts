import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  /**
   * Dummy Root Route
   * @returns { message: "Hello World" } 
   */
  @Get()
  getHello(): object {
    return this.appService.getHello();
  }
}
