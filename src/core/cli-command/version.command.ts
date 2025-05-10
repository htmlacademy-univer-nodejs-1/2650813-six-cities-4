import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    const jsonContent = readFileSync(resolve('package.json'), 'utf-8');
    const parsedContent = JSON.parse(jsonContent);
    return parsedContent.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(chalk.blue.bold(version));
  }
}
