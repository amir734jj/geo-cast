import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
  Index
} from 'typeorm';
import Token from './token.model';
import Post from './post.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import Role from './roles.model';
import { type EntityType, type ProfileType, type UserType } from '@geo-cast/lib/dto/account';

@Entity()
@Unique(['email'])
export default class User implements EntityType, UserType, ProfileType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty()
  @Index()
  @Column()
    active: boolean;

  @ApiProperty()
  @Column({ type: 'text', default: '' })
    description: string;

  @ApiProperty()
  @Column({ length: 256, default: '' })
    name: string;

  @ApiProperty()
  @Column({ length: 256, default: '' })
    email: string;

  @Exclude()
  @Column({ length: 256 })
    password: string;

  @Exclude()
  @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

  @JoinTable({ name: 'user-role-relationship' })
  @ManyToMany(() => Role, (role) => role.users)
    roles: Role[];

  @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

  @JoinTable({ name: 'user-post-like-relationship' })
  @ManyToMany(() => Post, (post) => post.likedBy)
    likes: Post[];
}
