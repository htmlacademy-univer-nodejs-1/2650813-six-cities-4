import { IRepository } from '../../db/repository.interface.js';
import { RentalOffer } from './rental-offer.dbo.js';
import mongoose from 'mongoose';

export interface IRentalService extends IRepository<RentalOffer> {
  deleteById(id: mongoose.Types.ObjectId): Promise<void>;
  findByIds(ids: mongoose.Types.ObjectId[]): Promise<RentalOffer[]>;
  findById(id: mongoose.Types.ObjectId): Promise<RentalOffer | null>;
  update(document: Partial<RentalOffer>): Promise<void>;
  updateImage(id: mongoose.Types.ObjectId, image: string): Promise<void>;
  addPhoto(id: mongoose.Types.ObjectId, image: string): Promise<void>;
}
