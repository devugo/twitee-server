import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.postComments)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Post, (post) => post.postComments)
  @JoinColumn()
  post: Post;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
