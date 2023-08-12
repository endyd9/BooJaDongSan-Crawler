import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisna.service';
import { Apt, Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async saveApt(data: Prisma.AptCreateInput): Promise<Apt> {
    console.log(data);

    return await this.prisma.apt.create({
      data,
    });
  }
}
