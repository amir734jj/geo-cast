import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostService from 'src/services/posts.service';
import Post from 'src/models/post.model';
import BoardController from 'src/controllers/board.controller';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigModule, ConfigService } from '@nestjs/config';
import BoardService from 'src/services/board.service';
import { AzureBlobProvider } from 'src/logic/azure-blob.provider';
import { FileSystemBlobProvider } from 'src/logic/filesystem-blob.provider';
import { S3BlobProvider } from 'src/logic/s3-provider';
import { AbstractBlobProvider } from 'src/abstracts/abstract.file.provider';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ConfigModule],
  controllers: [BoardController],
  providers: [PostService, BoardService, {
    provide: AbstractBlobProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const blobConnectionString = configService.get<string>('BLOB_CONNECTION_STRING');
      if (blobConnectionString != null) {
        return new AzureBlobProvider(BlobServiceClient.fromConnectionString(blobConnectionString));
      }

      const spacesKey = configService.get<string>('SPACES_KEY');
      const spacesSecret = configService.get<string>('SPACES_SECRET');
      const spacesEndpoint = configService.get<string>('SPACES_ENDPOINT');
      if (spacesKey != null && spacesSecret != null && spacesEndpoint != null) {
        return new S3BlobProvider(new S3Client({
          endpoint: spacesEndpoint,
          region: configService.get<string>('SPACES_REGION', 'us-east-1'),
          credentials: { accessKeyId: spacesKey, secretAccessKey: spacesSecret }
        }));
      }

      return new FileSystemBlobProvider();
    }
  }],
  exports: [PostService, BoardService]
})
export default class BoardModule { }
