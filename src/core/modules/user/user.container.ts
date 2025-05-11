import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {UserServiceInterface} from './user-service.interface.js';
import UserService from './user.service.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {UserEntity, UserModel} from './user.entity.js';
import {UserController} from './controller/user-controller.js';
import {BaseController} from '../../controller/base-controller.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);
  userContainer.bind<BaseController>(AppComponent.UserController).to(UserController).inSingletonScope();
  return userContainer;
}
