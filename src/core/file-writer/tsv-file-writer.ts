import {WriteStream} from 'node:fs';
import {createWriteStream} from 'node:fs';
import {FileWriterInterface} from './file-writer.interface.js';
import {TSV_FILE_WRITE_CHUNK_SIZE} from '../helpers/constants.js';

export default class TsvFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: TSV_FILE_WRITE_CHUNK_SIZE,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}
