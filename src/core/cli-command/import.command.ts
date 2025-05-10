import chalk from 'chalk';
import TsvFileReader from '../file-reader/tsv-file-reader.js';
import {getErrorMessage} from '../helpers/common.js';
import {createOffer} from '../helpers/offers.js';
import {CliCommandInterface} from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported`);
  }

  public async execute(filename: string): Promise<void> {
    if (filename === undefined) {
      console.log(chalk.red('Укажите после команды --import путь к файлу'));
    }
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    try {
      await fileReader.read();
    } catch (err) {
      console.error(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
