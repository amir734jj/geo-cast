import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import User from './users.model';
import IEntity from 'src/interfaces/entity.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export default class Post implements IEntity {
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
  @Column()
  recordingId: string;

  @ApiProperty()
  @Column({})
  created_at: Date;

  @Exclude()
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Exclude()
  @ManyToMany(() => User, (user) => user.likes)
  likedBy: User[];
}
