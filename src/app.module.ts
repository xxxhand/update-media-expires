import { Module } from '@nestjs/common';
import { CustomMongoClient, CustomDefinition } from '@xxxhand/app-common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_CLIENT } from './app.constants';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: MONGO_CLIENT,
      useFactory: async () => {
        const uri = 'mongodb://localhost:27017/pixie';
        const opt: CustomDefinition.IMongoOptions = {
          minPoolSize: 1,
          maxPoolSize: 10,
          connectTimeoutMS: 30 * 1000,
          user: '',
          pass: '',
          db: 'pixie'
        };
        const client = new CustomMongoClient(uri, opt);
        await client.tryConnect();
        return client;
      }
    }
  ],
})
export class AppModule { }
