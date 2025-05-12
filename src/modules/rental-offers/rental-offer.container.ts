import { ContainerModule } from 'inversify';
import { IRentalService } from './rental-service.interface.js';
import { RentalService } from './rental-service.js';
import { RentalOfferDbo } from './rental-offer.dbo.js';

export function setupOfferDIContainer(): ContainerModule {
  return new ContainerModule((bind) => {
    bind.bind<IRentalService>('RentalService').to(RentalService);
    bind.bind(Symbol.for('RentalOfferModel')).toConstantValue(RentalOfferDbo);
  });
}
