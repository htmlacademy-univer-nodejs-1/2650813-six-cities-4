import * as crypto from 'node:crypto';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
