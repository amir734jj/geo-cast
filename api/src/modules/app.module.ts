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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 5 },
      { name: 'medium', ttl: 10000, limit: 30 },
      { name: 'long', ttl: 60000, limit: 100 }
    ]),
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
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export default class AppModule { }
