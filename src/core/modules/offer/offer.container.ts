import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import OfferService from './offer.service.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {BaseController} from '../../controller/base-controller.js';
import OfferController from './controller/offer-controller.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<BaseController>(AppComponent.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
