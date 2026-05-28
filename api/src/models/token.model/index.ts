import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import User from '../users.model';
import { Exclude } from 'class-transformer';
import { type EntityType } from '@geo-cast/lib/dto/account';

@Entity()
export default class Token implements EntityType {
  @PrimaryGeneratedColumn()
    id: number;

  @Exclude()
  @Column({ length: 256 })
    value: string;

  @Index()
  @Column({})
    expiresIn: Date;

  @ManyToOne(() => User, (user) => user.tokens)
    user: User;
}
