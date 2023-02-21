import * as AWS from 'aws-sdk';

const validate = () => {
  if (!process.env.AWS_ACCESS_KEY_ID) throw 'Required: AWS_ACCESS_KEY_ID';
  if (!process.env.AWS_SECRET_ACCESS_KEY)
    throw 'Required: AWS_SECRET_ACCESS_KEY';
  if (!process.env.SNS_TOPIC_ARN) throw 'Required: SNS_TOPIC_ARN';
  if (!process.env.AWS_REGION) throw 'Required: AWS_REGION';
  return {
    sns_topic_arn: process.env.SNS_TOPIC_ARN,
    region: process.env.AWS_REGION,
  };
};

export const SNSPublisher = () => {
  const config = validate();
  AWS.config.update({ region: config.region });

  return {
    publish: async (message: string) => {
      // Create publish parameters
      const params = {
        Message: message /* required */,
        TopicArn: config.sns_topic_arn,
      };

      // Create promise and SNS service object
      const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' })
        .publish(params)
        .promise();

      // Handle promise's fulfilled/rejected states
      return publishTextPromise
        .then(function (data) {
          console.log(
            `Message ${params.Message} sent to the topic ${params.TopicArn}`,
          );
          console.log('MessageID is ' + data.MessageId);
          return data;
        })
        .catch(function (err) {
          console.error(err, err.stack);
        });
    },
  };
};
