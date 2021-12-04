import { AuthRoutes } from './route/auth';
import { PostRoutes } from './route/post';

export const Routes = [...AuthRoutes, ...PostRoutes];
