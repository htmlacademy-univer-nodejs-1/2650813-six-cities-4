import {UserEntity} from './user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto';
import {DEFAULT_AVATAR_FILE_NAME} from '../../helpers/constants.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);


    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offersFavorite = await this.userModel.findById(userId).select('favorite').exec();
    if (offersFavorite === null) {
      return [];
    }
    return this.userModel.find({_id: {$in: offersFavorite.favoriteOffers}});
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      return null;
    }
    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }
    return null;
  }
}
