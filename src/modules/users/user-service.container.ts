import { ContainerModule } from 'inversify';
import { UserService } from './user-service.interface.js';
import { UserDatabaseService } from './user-service.js';
import { UserModel } from './user-dbo.js';

export function setupUserDIContainer() {
  return new ContainerModule((options) => {
    options.bind('UserModel').toConstantValue(UserModel);
    options.bind<UserService>('UserService').to(UserDatabaseService);
  });
}
