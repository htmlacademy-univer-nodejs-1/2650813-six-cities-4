import {ParamsDictionary} from 'express-serve-static-core';

export type OfferIdParams = {
  offerId: string;
} | ParamsDictionary;
