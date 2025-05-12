import chalk from 'chalk';
import { readFileSync } from 'node:fs';

export const printAppVersion = () => {
  const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));
  return chalk.cyan(`Версия приложения: ${version}`);
};
