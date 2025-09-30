import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@/libs/common/src/database/abstract.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
