import { Response } from 'express';
import { CustomResult, CustomMongoClient } from '@xxxhand/app-common';
import { Controller, Get, Patch, Body, Param, Res, Inject } from '@nestjs/common';
import { MONGO_CLIENT } from './app.constants';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private _mediaColName = 'CmsMediaInfos';
  private _acceptMids: string[] = [
    'M0049'
  ];
  private readonly _foreverTime = 4102415999000;

  constructor(
    private readonly appService: AppService,
    @Inject(MONGO_CLIENT) private readonly dbClient: CustomMongoClient
    ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/reset_all')
  public async resetMediaExpired(@Res() res: Response): Promise<void> {
    const result = new CustomResult();
    const q = {
      'mid': { '$in': this._acceptMids }
    };
    const u = {
      'expiresAt': this._foreverTime
    };
    const col = this.dbClient.getCollection(this._mediaColName);
    await col.updateMany(q, { '$set': u });
    res.json(result);
  }

  @Patch('/:mid')
  public async setMediaExpired(
    @Param('mid') mid: string,
    @Body() body: { expiresAt: number },
    @Res() res: Response
  ): Promise<void> {
    const result = new CustomResult();
    if (!this._acceptMids.includes(mid)) {
      result.code = 99999;
      result.message = `${mid} is not allowed to set expires`;
      res.json(result);
      return;
    }
    const q = { mid };
    const u = { expiresAt: body.expiresAt };
    const col = this.dbClient.getCollection(this._mediaColName);
    await col.updateOne(q, { '$set':  u });
    
    res.json(result);

  }
}
