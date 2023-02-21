import { MongoClient } from 'mongodb';
import { FactoryProvider } from '@nestjs/common';

const conn_string = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : 'mongodb://127.0.0.1:27017/?directConnection=true';

export const DB_CLIENT = 'DB_CLIENT';

export const databaseProviders: FactoryProvider[] = [
  {
    provide: DB_CLIENT,
    useFactory: async (): Promise<MongoClient> => {
      return MongoClient.connect(conn_string)
        .then((conn) => {
          return conn;
        })
        .catch((e) => {
          console.log('provider error connecting to mongo', e);
          throw e;
        });
    },
  },
];
