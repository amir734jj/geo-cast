import { AbstractBlobProvider, type FileInfo } from 'src/abstracts/abstract.file.provider';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';

@Injectable()
export class S3BlobProvider extends AbstractBlobProvider {
  private readonly bucket = 'geo-cast';

  constructor (private readonly s3Client: S3Client) {
    super();
  }

  async download (id: string): Promise<FileInfo> {
    const [getResult, headResult] = await Promise.all([
      this.s3Client.send(new GetObjectCommand({ Bucket: this.bucket, Key: id })),
      this.s3Client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: id }))
    ]);

    return {
      readable: getResult.Body as Readable,
      filename: headResult.Metadata?.filename ?? 'recording.wav'
    };
  }

  async upload (id: string, stream: Buffer, filename: string): Promise<void> {
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: id,
      Body: stream,
      Metadata: { filename }
    }));
  }

  async delete (id: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: id
    }));
  }
}
