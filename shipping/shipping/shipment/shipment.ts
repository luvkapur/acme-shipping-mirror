export type ShipmentStatus = 'label-created' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';

/** one carrier scan, e.g. "in transit at the Memphis hub". */
export type ShipmentEvent = {
  status: ShipmentStatus;
  /** ISO timestamp of the scan. */
  at: string;
  /** where the scan happened, e.g. `Memphis, TN`. */
  location: string;
};

export type PlainShipment = {
  id: string;
  /** the order this parcel fulfils. */
  orderId: string;
  /** carrier name, e.g. `UPS`. */
  carrier: string;
  trackingNumber: string;
  /** ISO timestamp the carrier promises delivery by. */
  estimatedDelivery: string;
  /** carrier scans, in any order. */
  events: ShipmentEvent[];
};

/**
 * A parcel on its way to the customer. Shipping creates it once an order is
 * paid; its status is always the latest carrier scan, so the entity never
 * holds a separately stored status that could disagree with the events.
 */
export class Shipment {
  constructor(
    readonly id: string,
    readonly orderId: string,
    readonly carrier: string,
    readonly trackingNumber: string,
    readonly estimatedDelivery: string,
    readonly events: ShipmentEvent[]
  ) {}

  /** the events oldest first. carriers report scans out of order, so sort by time. */
  get timeline(): ShipmentEvent[] {
    return [...this.events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  }

  /** the most recent scan, or `undefined` before the first one. */
  get latestEvent(): ShipmentEvent | undefined {
    const timeline = this.timeline;
    return timeline[timeline.length - 1];
  }

  /** the status of the latest scan. a shipment without scans has just had its label created. */
  get status(): ShipmentStatus {
    return this.latestEvent?.status ?? 'label-created';
  }

  /** true once the carrier has scanned the parcel as delivered. */
  get delivered(): boolean {
    return this.status === 'delivered';
  }

  toObject(): PlainShipment {
    return {
      id: this.id,
      orderId: this.orderId,
      carrier: this.carrier,
      trackingNumber: this.trackingNumber,
      estimatedDelivery: this.estimatedDelivery,
      events: this.events,
    };
  }

  static from(plain: PlainShipment) {
    return new Shipment(plain.id, plain.orderId, plain.carrier, plain.trackingNumber, plain.estimatedDelivery, plain.events);
  }
}
