import { Response } from 'express';
import { MongoClient } from 'mongodb';
import { Controller, Get, Patch, Body, Param, Res, Inject } from '@nestjs/common';
import { MONGO_CLIENT } from './app.constants';

import { AppService } from './app.service';

interface ICustomResult {
  code: number;
  message: string;
}

@Controller()
export class AppController {
  private _dbName: string = 'pixie';
  private _mediaColName = 'CmsMediaInfos';
  private _acceptMids: string[] = [
    "M0056", "M0057", "M0058", "M0061", "M0064", "M0065", "M0074", "M0075", "M0098",
    "M0318", "M0297", "M0270", "M0274", "M0275",
    "M0021", "M0023", "M0028", "M0029", "M0093", "M0120", "M0122", "M0126", "M0127", "M0128"
  ];
  private readonly _foreverTime = 4102415999000;

  constructor(
    private readonly appService: AppService,
    @Inject(MONGO_CLIENT) private readonly dbClient: MongoClient
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/reset_all')
  public async resetMediaExpired(@Res() res: Response): Promise<void> {
    const q = {
      'mid': { '$in': this._acceptMids }
    };
    const u = {
      'expiresAt': this._foreverTime
    };
    const col = this.dbClient.db(this._dbName).collection(this._mediaColName);
    await col.updateMany(q, { '$set': u });
    res.json({});
  }

  @Patch('/:mid')
  public async setMediaExpired(
    @Param('mid') mid: string,
    @Body() body: { expiresAt: number },
    @Res() res: Response
  ): Promise<void> {
    const result: ICustomResult = {
      code: 0,
      message: ''
    };
    if (!this._acceptMids.includes(mid)) {
      result.code = 99999;
      result.message = `${mid} is not allowed to set expires`;
      res.json(result);
      return;
    }
    const q = { mid };
    const u = { expiresAt: body.expiresAt };
    const col = this.dbClient.db(this._dbName).collection(this._mediaColName);
    await col.updateOne(q, { '$set': u });

    res.json(result);

  }
}
