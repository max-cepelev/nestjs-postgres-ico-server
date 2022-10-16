import * as path from 'path';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BuildingsModule } from './buildings/buildings.module';
import { Building } from './buildings/entities/building.entity';
import { ComplexesModule } from './complexes/complexes.module';
import { Complex } from './complexes/entities/complex.entity';
import { DevelopersModule } from './developers/developers.module';
import { Developer } from './developers/entities/developer.entity';
import { Group } from './groups/entities/group.entity';
import { GroupsModule } from './groups/groups.module';
import { Lead } from './leads/entities/lead.entity';
import { LeadsModule } from './leads/leads.module';
import { Role } from './roles/entities/roles.entity';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MacroModule } from './macro/macro.module';
import { SalesModule } from './sales/sales.module';
import { Sale } from './sales/entities/sale.entity';
import { Token } from './tokens/entities/token.entity';
import { TokensModule } from './tokens/tokens.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OffersModule } from './offers/offers.module';
import { Offer } from './offers/entities/offers.entity';
import { ConfigModule } from '@nestjs/config';
import { CitiesModule } from './cities/cities.module';
import { RegionsModule } from './regions/regions.module';
import { PropertiesModule } from './properties/properties.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { City } from './cities/entities/city.entity';
import { Region } from './regions/entities/region.entity';
import { Property } from './properties/entities/property.entity';
import { PropertyType } from './property-types/entities/property-type.entity';
import { ParsingModule } from './parsing/parsing.module';
import { AreasModule } from './areas/areas.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Area } from './areas/entities/area.entity';
import { LogsModule } from './logs/logs.module';
import { Log } from './logs/entities/log.entity';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_USER,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Region,
        City,
        Area,
        Group,
        Developer,
        Complex,
        Building,
        Property,
        PropertyType,
        Offer,
        Sale,
        Role,
        Lead,
        User,
        Token,
        Log,
      ],
      autoLoadModels: true,
    }),
    BuildingsModule,
    ComplexesModule,
    DevelopersModule,
    GroupsModule,
    LeadsModule,
    RolesModule,
    SalesModule,
    TokensModule,
    UsersModule,
    AuthModule,
    MacroModule,
    OffersModule,
    CitiesModule,
    RegionsModule,
    PropertiesModule,
    PropertyTypesModule,
    ParsingModule,
    AreasModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
