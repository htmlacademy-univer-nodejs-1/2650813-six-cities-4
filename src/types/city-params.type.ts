import {ParamsDictionary} from 'express-serve-static-core';

export type CityParams = {
  city: string;
} | ParamsDictionary
