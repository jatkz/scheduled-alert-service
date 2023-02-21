import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';
import { DB_CLIENT } from './database.provider';
import * as Yup from 'yup';
import { SNSPublisher } from './sns-publisher';

const ConfigSchema = Yup.array()
  .of(
    Yup.object({
      databaseName: Yup.string().required(),
      collectionName: Yup.string().required(),
      datetimeField: Yup.string().required(),
      documentAge: Yup.number().required(),
    }),
  )
  .required(
    'Required: Array of objects [{databaseName,collectionName,datetimeField,documentAge}]',
  );

type AlertConfig = Yup.InferType<typeof ConfigSchema>;

const parseConfig = () => {
  try {
    return JSON.parse(process.env.ALERT_CONFIG || '[]');
  } catch (err) {
    throw 'alert config parse failed, make sure it is valid json';
  }
};

const alertCheck: { cronExpression: string; config: AlertConfig } = {
  cronExpression: process.env.CRON_SCHEDULE || '0 * */1 * * *',
  config: ConfigSchema.validateSync(parseConfig()) || [],
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject(DB_CLIENT)
    private dbClient: MongoClient,
  ) {}

  @Cron(alertCheck.cronExpression)
  async alertCheck() {
    this.logger.debug('AlertCheck init ', alertCheck.cronExpression);
    for (const i of alertCheck.config) {
      const filter = {
        [i.datetimeField]: { $gt: +new Date() - 1_000 * i.documentAge },
      };
      const collection = this.dbClient
        .db(i.databaseName)
        .collection(i.collectionName);

      const found = await collection.findOne(filter);

      if (found) {
        const numberOfDocs = await collection.countDocuments(filter);

        await this.runAlert(
          `Number of recent errors: ${numberOfDocs} \nexample: ${JSON.stringify(
            found,
          )}`,
        );
      }
    }
  }

  async runAlert(message: string) {
    const sns = SNSPublisher();
    return sns.publish(message);
  }

  getAlertConfig() {
    return alertCheck;
  }
}
