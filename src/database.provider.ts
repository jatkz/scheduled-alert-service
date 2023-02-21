import { MongoClient } from 'mongodb';
import { FactoryProvider } from '@nestjs/common';

const conn_string = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : 'mongodb://127.0.0.1:27017';

export const DB_CLIENT = 'DB_CLIENT';

export const databaseProviders: FactoryProvider[] = [
  {
    provide: DB_CLIENT,
    useFactory: async (): Promise<MongoClient> => {
      return MongoClient.connect(conn_string)
        .then((conn) => {
          console.log('connection success');
          return conn;
        })
        .catch((e) => {
          console.error('provider error connecting to mongo', e);
          throw e;
        });
    },
  },
];
