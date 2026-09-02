import { rateQuote } from './rate-quote.js';

it('quotes a 2kg parcel to zone 0', () => {
  expect(rateQuote(2, 0)).toEqual(740);
});
