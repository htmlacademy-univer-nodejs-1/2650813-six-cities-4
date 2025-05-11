export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be valid'
  },
  avatarPath: {
    invalidFormat: 'avatarPath is required',
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length = 1, max length = 15',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length = 6, max length = 12'
  },
  userType: {
    invalidFormat: 'userType is required',
  }
} as const;
