import { Module } from '@nestjs/common';
import DatabaseModule from './database.module';
import UserModule from './user.module';
import AuthModule from './auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import HealthModule from './health.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import BoardModule from './board.module';
import { MulterModule } from '@nestjs/platform-express';
import bytes from 'bytes';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
        limits: {
          fieldSize: bytes('10mb') as number // hard max file size
        }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    BoardModule,
    HealthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    })
  ],
  controllers: [],
  providers: []
})
export default class AppModule { }
