export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length = 5, max = 2024'
  },
  offerId: {
    invalidFormat: 'offerId must be valid id'
  },
  userId: {
    invalidFormat: 'userId must be valid id'
  },
  date: {
    invalidFormat: 'date must be valid ISO date',
  },
  rating: {
    invalidFormat: 'rating must be number',
  },
} as const;
