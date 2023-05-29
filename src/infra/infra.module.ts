import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChassisModule } from './chassis.module';
import { SecaoSchema } from './schemas/secao.schema';

@Module({
  imports: [
    ChassisModule,
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_CONNECTION_STRING');
        const dbName = configService.get<string>('DATABASE_NAME');
        return { uri, dbName };
      },
    }),
    MongooseModule.forFeature([{ name: 'secoes', schema: SecaoSchema }]),
  ],
  providers: [],
  exports: [],
})
export class InfraModule {}
