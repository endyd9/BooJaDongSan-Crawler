import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async saveApt() {
    const data: Prisma.AptCreateInput = {
      name: '테스트 아파트',
      dedicatedArea: 89,
      floor: 15,
      buildYear: 2015,
      treadDate: 181203,
      treadAmount: 15,
      cityCode: '0003',
      dong: '테스트동',
      roadName: '테스트로',
      buildingNum: 25,
      buildingMinorNum: 10,
    };
    this.appService.saveApt(data);
  }
}
