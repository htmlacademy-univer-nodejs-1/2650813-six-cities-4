export const DEFAULT_DB_PORT = '27017';
export const DEFAULT_USER_PASSWORD = '123456';

export const MONGO_RETRY_COUNT = 5;
export const MONGO_RETRY_TIMEOUT = 1000;

export const TSV_FILE_READ_CHUNK_SIZE = 16_384;
export const TSV_FILE_WRITE_CHUNK_SIZE = 65_536;

export const MIN_COST = 100;
export const MAX_COST = 100_000;

export const DEFAULT_OFFER_COUNT = 60;
export const DEFAULT_PREMIUM_OFFER_COUNT = 3;

export const FIRST_WEEK_DAY = 1;
export const LAST_WEEK_DAY = 7;

export const JWT_ALGORITHM = 'HS256';

export const DEFAULT_AVATAR_FILE_NAME = 'default-avatar.jpg';
export const DEFAULT_STATIC_IMAGES = [
  DEFAULT_AVATAR_FILE_NAME
];

export const STATIC_RESOURCE_FIELDS = [
  'avatarPath',
  'image'
];
