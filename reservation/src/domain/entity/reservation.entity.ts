import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@/libs/common/src/database/abstract.entity';

@Entity('reservations')
export class Reservation extends AbstractEntity {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  invoiceId: string;
}