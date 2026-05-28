import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { type EntityType } from '@geo-cast/lib/dto/account'
import User from './users.model'

@Entity()
@Unique(['name'])
export default class Role implements EntityType {
  @Exclude()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column({ length: 256, default: '' })
    name: string

  @ManyToMany(() => User, (user) => user.roles)
    users: User[]
}
