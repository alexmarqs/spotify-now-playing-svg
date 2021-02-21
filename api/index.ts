import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse) => {
  // fetch your spotify data

  // build template

  // prepare response to svg image + cache

  const { name = 'World' } = request.query;
  response.status(200).send(`Hello ${name}!`);
};
