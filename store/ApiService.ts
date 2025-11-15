import { instance, formInstance, Axios } from './axios_context';
import {createApiServices} from '@clipo/core';

const { AuthService, UserService, SocialService } = createApiServices({
  instance,
  formInstance,
  request: Axios,
});

export { AuthService, UserService, SocialService };

export default { AuthService, UserService, SocialService };
