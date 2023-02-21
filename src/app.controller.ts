import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('alert')
  async runAlert(@Body() body: { message?: string }) {
    if (!body.message) {
      throw new HttpException('required: body message', HttpStatus.BAD_REQUEST);
    }
    return this.appService.runAlert(body.message).then((d) => {
      if (d) {
        return { message: 'success', id: d.MessageId };
      } else {
        // no return value means failure
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
