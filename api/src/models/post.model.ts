import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, Index } from 'typeorm';
import User from './users.model';
import { type EntityType } from '@geo-cast/lib/dto/account';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['latitude', 'longitude'])
export default class Post implements EntityType {
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty()
  @Column({ type: 'decimal' })
    longitude: number;

  @ApiProperty()
  @Column({ type: 'decimal' })
    latitude: number;

  @ApiProperty()
  @Column({ type: 'decimal' })
    duration: number;

  @ApiProperty()
  @Column({ unique: true })
    recordingId: string;

  @ApiProperty()
  @Index()
  @Column({})
    created_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
    user: User;

  @Exclude()
  @ManyToMany(() => User, (user) => user.likes)
    likedBy: User[];
}
