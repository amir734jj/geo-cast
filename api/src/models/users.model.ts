import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Token from './token.model';
import Post from './post.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import IEntity from 'src/interfaces/entity.interface';
import Role from './roles.model';
import { ProfileType, UserType } from '@geo-cast/lib/dto/account';

@Entity()
@Unique(['email'])
export default class User implements IEntity, UserType, ProfileType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  active: boolean;

  @ApiProperty()
  @Column({ type: "text", default: '' })
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
