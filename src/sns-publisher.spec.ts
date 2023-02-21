/**
npx nx test microsoft-business-central --skip-no-cache --test-file client-logic-payloads/tests/estimated-cost.spec.ts
 */

import { SNSPublisher } from './sns-publisher';

jest.setTimeout(20000);

describe('SNS Publisher', () => {
  const snsPublisher = SNSPublisher();

  it('publish success response', async () => {
    const response = await snsPublisher.publish('sns publisher test');
    console.log(response);
    expect(response).toBeTruthy();
  });
});
