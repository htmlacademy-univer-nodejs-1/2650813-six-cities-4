import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { resolve, join } from 'node:path';
import { promises as fs } from 'node:fs';
import { IMiddleware } from '../middleware.interface.js';

export class FileUploadMiddleware implements IMiddleware {
  constructor(
    private readonly baseDirectory: string,
    private readonly directory: string,
    private readonly fieldName: string,
    private readonly allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
    private readonly fileSizeLimit: number = 5 * 1024 * 1024
  ) {
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Content-Type header is missing'
      });
      return;
    }

    if (!this.allowedTypes.includes(contentType)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `File type "${contentType}" is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`
      });
      return;
    }

    const chunks: Uint8Array[] = [];
    let size = 0;

    req.on('data', (chunk) => {
      chunks.push(chunk);
      size += chunk.length;

      if (size > this.fileSizeLimit) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: `File too large. Maximum size is ${this.fileSizeLimit / 1024 / 1024}MB`
        });
        req.destroy();
      }
    });

    req.on('error', (err) => {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `Upload error: ${err.message}`
      });
    });

    req.on('end', async () => {
      if (res.writableEnded) {
        return;
      }

      const buffer = Buffer.concat(chunks);

      const fileExtension = extension(contentType) || 'bin';
      const fileName = `${nanoid()}.${fileExtension}`;

      const directoryPath = this.baseDirectory;
      const destinationPath = resolve(directoryPath, this.directory);
      await fs.mkdir(destinationPath, {recursive: true});

      const filePath = join(destinationPath, fileName);

      await fs.writeFile(filePath, new Uint8Array(buffer));

      const relativePath = filePath
        .split(directoryPath)[1]
        .replace(/\\/g, '/');

      req.body = req.body || {};
      req.body[this.fieldName] = `/uploads${relativePath}`;

      next();

    });
  }
}
