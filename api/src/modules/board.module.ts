import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import PostService from 'src/services/posts.service'
import Post from 'src/models/post.model'
import BoardController from 'src/controllers/board.controller'
import { BlobServiceClient } from '@azure/storage-blob'
import { ConfigModule, ConfigService } from '@nestjs/config'
import BoardService from 'src/services/board.service'
import { AzureBlobProvider } from 'src/logic/azure-blob.provider'
import { FileSystemBlobProvider } from 'src/logic/filesystem-blob.provider'
import { AbstractBlobProvider } from 'src/abstracts/abstract.file.provider'

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ConfigModule],
  controllers: [BoardController],
  providers: [PostService, BoardService, {
    provide: AbstractBlobProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      if (configService.get<string>('ENV') === 'Production') {
        return new AzureBlobProvider(BlobServiceClient.fromConnectionString(configService.getOrThrow<string>('BLOB_CONNECTION_STRING')))
      } else {
        return new FileSystemBlobProvider()
      }
    }
  }],
  exports: [PostService, BoardService]
})
export default class BoardModule { }
