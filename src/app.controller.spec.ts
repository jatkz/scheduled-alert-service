import { Test, TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { DB_CLIENT } from './database.provider';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let conn: MongoClient;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    conn = app.get(DB_CLIENT);
  });

  afterEach(async () => {
    await app.close();
    await conn.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', (done) => {
      expect(appController.getHello()).toBe('Hello World!');
      done();
    });
  });
});
