import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveryOptions, deliveryOptionsFor } from './delivery-options.js';

it('prices standard at the rate quote and faster services as multiples of it', () => {
  // rateQuote(2, 0) is 790 cents
  expect(deliveryOptionsFor(2, 0)).toEqual([
    { id: 'standard', label: 'Standard', days: 5, cents: 790 },
    { id: 'express', label: 'Express', days: 2, cents: 1264 },
    { id: 'next-day', label: 'Next day', days: 1, cents: 1896 },
  ]);
});

it('rounds the multiplied prices to whole cents', () => {
  // rateQuote(2, 1) is 988 cents: 988 x 1.6 = 1580.8 and 988 x 2.4 = 2371.2
  expect(deliveryOptionsFor(2, 1).map((option) => option.cents)).toEqual([988, 1581, 2371]);
});

it('makes standard delivery free from 20 kg and keeps the faster services priced', () => {
  // rateQuote(20, 0) is 2950 cents: 2950 x 1.6 = 4720 and 2950 x 2.4 = 7080
  expect(deliveryOptionsFor(20, 0).map((option) => option.cents)).toEqual([0, 4720, 7080]);
  expect(deliveryOptionsFor(30, 3)[0].cents).toEqual(0);
});

it('charges standard delivery just under 20 kg', () => {
  // rateQuote(19.9, 0) is 2938 cents
  expect(deliveryOptionsFor(19.9, 0)[0].cents).toEqual(2938);
});

it('renders a labelled radio per option with its price', () => {
  render(<DeliveryOptions weightKg={2} zone={0} value="express" onChange={() => {}} />);
  expect(screen.getAllByRole('radio')).toHaveLength(3);
  expect((screen.getByRole('radio', { name: /Express/ }) as HTMLInputElement).checked).toBe(true);
  expect(screen.getByText('$18.96')).toBeTruthy();
});

it('passes the whole option on when the customer picks one', () => {
  const onChange = vi.fn();
  render(<DeliveryOptions weightKg={2} zone={0} onChange={onChange} />);
  fireEvent.click(screen.getByRole('radio', { name: /Next day/ }));
  expect(onChange).toHaveBeenCalledWith({ id: 'next-day', label: 'Next day', days: 1, cents: 1896 });
  expect((screen.getByRole('radio', { name: /Next day/ }) as HTMLInputElement).checked).toBe(true);
});
