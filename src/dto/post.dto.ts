import { User } from '../entity/User';

export type PostDto = {
  body: string;
  user?: User;
};
