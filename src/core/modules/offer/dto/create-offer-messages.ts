export const CreateOfferMessages = {
  name: {
    minLength: 'min name length = 10',
    maxLength: 'max name length = 100',
  },
  description: {
    minLength: 'min description length = 20',
    maxLength: 'max description length = 1024',
  },
  date: {
    invalidFormat: 'date must be valid ISO date',
  },
  city: {
    invalidFormat: 'city must be valid string',
  },
  previewImage: {
    invalidFormat: 'previewImage must be valid string',
  },
  images: {
    invalidFormat: 'Field images must be an array',
  },
  isPremium: {
    invalidFormat: 'isPremium must be boolean',
  },
  isFavourite: {
    invalidFormat: 'isFavourite must be boolean',
  },
  rating: {
    invalidFormat: 'rating must be number',
    lengthField: 'min length = 1, max length = 5',
  },
  housing: {
    invalidFormat: 'housing must be valid string',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be integer',
    lengthField: 'min length = 1, max length = 8',
  },
  peopleCount: {
    invalidFormat: 'peopleCount must be integer',
    lengthField: 'min length = 1, max length = 10',
  },
  price: {
    invalidFormat: 'price must be integer',
    lengthField: 'min length = 100, max length = 100000',
  },
  conveniences: {
    invalidFormat: 'conveniences must be valid string',
  },
  author: {
    invalidId: 'userId must be valid id',
  },
  coordinates: {
    invalidFormat: 'coordinates must be valid object',
  },
} as const;
