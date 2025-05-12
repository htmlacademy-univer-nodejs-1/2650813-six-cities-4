import { injectable } from 'inversify';
import { User, UserModel } from './user-dbo.js';
import { UserService } from './user-service.interface.js';
import mongoose from 'mongoose';

@injectable()
export class UserDatabaseService implements UserService {
  async updateAvatar(userId: mongoose.Types.ObjectId, link: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { avatar: link } }
    ).exec();
  }

  async addToFavorites(userId: mongoose.Types.ObjectId, offerId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { favorite: offerId } }
    ).exec();
  }

  async deleteFromFavorites(userId: mongoose.Types.ObjectId, offerId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { favorite: offerId } }
    ).exec();
  }

  async find(query: Partial<User>): Promise<User[]> {
    return UserModel.find(query).exec();
  }

  async create(document: User): Promise<User> {
    const user = new UserModel(document);
    return user.save();
  }

  async findById(userId: mongoose.Types.ObjectId): Promise<User | null> {
    return UserModel.findById(userId).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({email}).exec();
  }
}
