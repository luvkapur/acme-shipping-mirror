import classNames from 'classnames';
import { Badge } from '@acme-modular/design.ui.badge';
import type { Shipment, ShipmentStatus } from '@acme-modular/shipping.shipping.shipment';
import styles from './tracking-timeline.module.css';

export type TrackingTimelineProps = {
  /** the shipment to show. its events are shown oldest first. */
  shipment: Shipment;
  className?: string;
};

const statusLabels: Record<ShipmentStatus, string> = {
  'label-created': 'Label created',
  'picked-up': 'Picked up by the carrier',
  'in-transit': 'In transit',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  exception: 'Delivery issue',
};

const statusTones: Record<ShipmentStatus, 'neutral' | 'positive' | 'negative' | 'info'> = {
  'label-created': 'neutral',
  'picked-up': 'neutral',
  'in-transit': 'info',
  'out-for-delivery': 'info',
  delivered: 'positive',
  exception: 'negative',
};

// timestamps are stored in UTC; formatting in UTC keeps server, browser and tests in agreement.
const scanTime = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

/**
 * The tracking history of a shipment as an ordered list, oldest scan first,
 * with the latest scan highlighted and marked as the current step.
 */
export function TrackingTimeline({ shipment, className }: TrackingTimelineProps) {
  const timeline = shipment.timeline;
  const latest = timeline.length - 1;

  return (
    <section className={classNames(styles.trackingTimeline, className)} aria-label={`Tracking for order ${shipment.orderId}`}>
      <header className={styles.header}>
        <div>
          <div className={styles.carrier}>
            {shipment.carrier} <span className={styles.trackingNumber}>{shipment.trackingNumber}</span>
          </div>
          <div className={styles.eta}>
            {shipment.delivered
              ? 'Delivered'
              : `Estimated delivery ${dayFormat.format(new Date(shipment.estimatedDelivery))}`}
          </div>
        </div>
        <Badge tone={statusTones[shipment.status]}>{statusLabels[shipment.status]}</Badge>
      </header>

      {timeline.length === 0 ? (
        <p className={styles.empty}>No scans yet. The carrier will update tracking once it picks up the parcel.</p>
      ) : (
        <ol className={styles.events}>
          {timeline.map((event, index) => (
            <li
              key={`${event.at}-${event.status}`}
              className={classNames(styles.event, index === latest && styles.latest)}
              aria-current={index === latest ? 'step' : undefined}
            >
              <span className={styles.status}>{statusLabels[event.status]}</span>
              <span className={styles.meta}>
                {event.location} · <time dateTime={event.at}>{scanTime.format(new Date(event.at))}</time>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
