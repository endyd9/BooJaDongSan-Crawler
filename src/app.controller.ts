import { Controller, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';
import axios from 'axios';

interface AptInfo {
  아파트: string;
  전용면적: number;
  층: number;
  건축년도: number;
  년: number;
  월: number;
  일: number;
  거래금액: string;
  지역코드: number;
  법정동: string;
  도로명: string;
  도로명건물본번호코드: string;
  도로명건물부번호코드: string;
}

interface AptResponse {
  response: {
    body: {
      items: {
        item: any;
      };
    };
  };
}

interface RequestQuery {
  code: string;
  year: string;
}

const codeList: number[] = [
  11680, 11740, 11305, 11500, 11620, 11215, 11530, 11545, 11350, 11320, 11230,
  11590, 11440, 11410, 11650, 11200, 11290, 11710, 11470, 11560, 11170, 11380,
  11010, 11140, 11260,
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/')
  async saveApt() {
    // for (let year = 2016; year < 2023; year++) {
    const year = 2016;
    for (const code of codeList) {
      let month = '1';
      for (let i = 0; i < 12; i++) {
        const {
          data: {
            response: {
              body: {
                items: { item },
              },
            },
          },
        } = await axios.get<AptResponse>(
          `${process.env.REQUEST_URL}?serviceKey=${
            process.env.API_KEY
          }&pageNo=${1}&numOfRows=${1000}&LAWD_CD=${code}&DEAL_YMD=${
            year + month.padStart(2, '0')
          }`,
        );

        if (item !== undefined) {
          if (item.length === undefined) {
            const data: Prisma.AptCreateInput = {
              name: item.아파트,
              dedicatedArea: item.전용면적,
              floor: item.층,
              buildYear: item.건축년도,
              treadDate:
                item.년 +
                '' +
                item.월 +
                ''.padStart(2, '0') +
                item.일 +
                ''.padStart(2, '0'),
              treadAmount: +item.거래금액.replaceAll(',', ''),
              cityCode: item.지역코드,
              dong: item.법정동,
              roadName: item.도로명,
              buildingNum: item.도로명건물본번호코드,
              buildingMinorNum: item.도로명건물부번호코드,
            };
            await this.appService.saveApt(data);
          } else {
            item.forEach(async (apt: AptInfo) => {
              const data: Prisma.AptCreateInput = {
                name: apt.아파트,
                dedicatedArea: apt.전용면적,
                floor: apt.층,
                buildYear: apt.건축년도,
                treadDate:
                  apt.년 +
                  '' +
                  apt.월 +
                  ''.padStart(2, '0') +
                  apt.일 +
                  ''.padStart(2, '0'),
                treadAmount: +apt.거래금액.replaceAll(',', ''),
                cityCode: apt.지역코드,
                dong: apt.법정동,
                roadName: apt.도로명,
                buildingNum: apt.도로명건물본번호코드,
                buildingMinorNum: apt.도로명건물부번호코드,
              };
              await this.appService.saveApt(data);
            });
          }
        }
        month = +month + 1 + '';
      }
    }
    // }
  }
}
