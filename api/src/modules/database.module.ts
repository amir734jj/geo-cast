import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('ENV') === 'Production'
        const defaultOptions = {
          applicationName: configService.get<string>('APP_NAME'),
          synchronize: !isProduction,
          migrationsRun: false,
          logging: false,
          autoLoadEntities: true,
          cache: true
        }

        if (isProduction) {
          return {
            ...defaultOptions,
            type: 'postgres',
            url: configService.getOrThrow<string>('DATABASE_URL'),
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          }
        } else {
          return {
            ...defaultOptions,
            type: 'sqlite',
            database: 'database.sqlite'
          }
        }
      }
    })
  ]
})
export default class DatabaseModule {}
