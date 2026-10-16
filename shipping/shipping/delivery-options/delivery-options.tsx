import { useId, useState } from 'react';
import classNames from 'classnames';
import { Money } from '@acme-modular/platform.entities.money';
import { PriceTag } from '@acme-modular/design.ui.price-tag';
import { rateQuote } from '@acme-modular/shipping.shipping.rate-quote';
import styles from './delivery-options.module.css';

export type DeliveryOption = {
  id: 'standard' | 'express' | 'next-day';
  label: string;
  /** business days until delivery. */
  days: number;
  /** price in cents. */
  cents: number;
};

// faster services are priced as a multiple of the standard rate quote.
const services: { id: DeliveryOption['id']; label: string; days: number; factor: number }[] = [
  { id: 'standard', label: 'Standard', days: 5, factor: 1 },
  { id: 'express', label: 'Express', days: 2, factor: 1.6 },
  { id: 'next-day', label: 'Next day', days: 1, factor: 2.4 },
];

/** orders of at least this many items ship express for free. */
export const FREE_EXPRESS_MIN_ITEMS = 10;

/**
 * The delivery services for a parcel, from slowest to fastest. Standard is the
 * `rateQuote` for the weight and zone; express costs 1.6 times that and
 * next-day 2.4 times, rounded to whole cents. Express is free for orders of
 * `FREE_EXPRESS_MIN_ITEMS` items or more.
 *
 * @param weightKg parcel weight in kilograms.
 * @param zone shipping zone, 0 for local.
 * @param itemCount number of items in the order. leave it out to price without the free express offer.
 * @example
 * deliveryOptionsFor(2, 0).map((option) => option.cents); // [790, 1264, 1896]
 * deliveryOptionsFor(20, 0, 10).map((option) => option.cents); // express is 0
 */
export function deliveryOptionsFor(weightKg: number, zone: number, itemCount = 0): DeliveryOption[] {
  const standard = new Money(rateQuote(weightKg, zone));
  const freeExpress = itemCount >= FREE_EXPRESS_MIN_ITEMS;
  return services.map(({ factor, ...service }) => ({
    ...service,
    cents: freeExpress && service.id === 'express' ? 0 : standard.multiply(factor).amountCents,
  }));
}

export type DeliveryOptionsProps = {
  /** parcel weight in kilograms. */
  weightKg: number;
  /** shipping zone, 0 for local. */
  zone: number;
  /** number of items in the order. orders of `FREE_EXPRESS_MIN_ITEMS` or more get free express. */
  itemCount?: number;
  /** the selected option. leave it out to let the component track the selection itself. */
  value?: DeliveryOption['id'];
  /** called with the full option, price included, when the customer picks one. */
  onChange: (option: DeliveryOption) => void;
  className?: string;
};

function deliveryTime(days: number) {
  return days === 1 ? '1 business day' : `${days} business days`;
}

/**
 * A radio group of delivery services with a price per option, priced by
 * `deliveryOptionsFor`. A free express option shows its regular price struck through.
 */
export function DeliveryOptions({ weightKg, zone, itemCount, value, onChange, className }: DeliveryOptionsProps) {
  const name = useId();
  const [picked, setPicked] = useState<DeliveryOption['id'] | undefined>(value);
  const selected = value ?? picked;
  const options = deliveryOptionsFor(weightKg, zone, itemCount);
  const regular = deliveryOptionsFor(weightKg, zone);

  return (
    <fieldset className={classNames(styles.deliveryOptions, className)}>
      <legend className={styles.legend}>Delivery</legend>
      {options.map((option, index) => (
        <label key={option.id} className={classNames(styles.option, selected === option.id && styles.selected)}>
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={selected === option.id}
            onChange={() => {
              setPicked(option.id);
              onChange(option);
            }}
            className={styles.radio}
          />
          <span className={styles.text}>
            <span className={styles.label}>{option.label}</span>
            <span className={styles.days}>{deliveryTime(option.days)}</span>
          </span>
          <PriceTag cents={option.cents} compareAtCents={regular[index].cents} />
        </label>
      ))}
    </fieldset>
  );
}
