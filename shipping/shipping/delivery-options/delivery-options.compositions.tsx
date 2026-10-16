import { useState } from 'react';
import { AcmeTheme } from '@acme-modular/design.theme.acme-theme';
import { DeliveryOptions } from './delivery-options.js';
import type { DeliveryOption } from './delivery-options.js';

export const LocalParcel = () => (
  <AcmeTheme>
    <DeliveryOptions weightKg={2} zone={0} onChange={() => {}} />
  </AcmeTheme>
);

export const ControlledSelection = () => {
  const [option, setOption] = useState<DeliveryOption>();
  return (
    <AcmeTheme>
      <DeliveryOptions weightKg={6} zone={1} value={option?.id ?? 'express'} onChange={setOption} />
      <p>Selected: {option ? `${option.label} (${option.cents} cents)` : 'Express (default)'}</p>
    </AcmeTheme>
  );
};

// a standing desk ships at roughly 30 kg across the country.
export const HeavyLongDistance = () => (
  <AcmeTheme>
    <DeliveryOptions weightKg={30} zone={3} value="standard" onChange={() => {}} />
  </AcmeTheme>
);

// ten items or more ship express for free.
export const FreeExpressLargeOrder = () => (
  <AcmeTheme>
    <DeliveryOptions weightKg={24} zone={1} itemCount={12} value="express" onChange={() => {}} />
  </AcmeTheme>
);
