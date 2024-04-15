import { Module } from '@nestjs/common';
import { MongoClient, MongoClientOptions } from 'mongodb';
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
        const dbName = 'pixie'
        const uri = `mongodb://localhost:27017/${dbName}`;
        const user = '{your name}';
        const pass = '{your pass}';
        const opt: MongoClientOptions = {
          minPoolSize: 1,
          maxPoolSize: 10,
          connectTimeoutMS: 30 * 1000,
          auth: {
            username: user,
            password: pass,
          },
          directConnection: true
        };
        const client = new MongoClient(uri, opt);
        await client.connect();
        return client;
      }
    }
  ],
})
export class AppModule { }
