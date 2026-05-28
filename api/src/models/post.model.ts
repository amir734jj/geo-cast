import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, CreateDateColumn } from 'typeorm'
import User from './users.model'
import { type EntityType } from '@geo-cast/lib/dto/account'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

@Entity()
export default class Post implements EntityType {
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column({ type: 'decimal' })
    longitude: number

  @ApiProperty()
  @Column({ type: 'decimal' })
    latitude: number

  @ApiProperty()
  @Column({ type: 'decimal' })
    duration: number

  @ApiProperty()
  @Column()
    recordingId: string

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

  @ManyToOne(() => User, (user) => user.posts)
    user: User

  @Exclude()
  @ManyToMany(() => User, (user) => user.likes)
    likedBy: User[]
}
