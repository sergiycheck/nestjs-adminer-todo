import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './root-module/app.module.js';
import { ConfigService } from '@nestjs/config';

import AdminJSExpress from '@adminjs/express';
import { TodoModel } from './todos/entities/todo.entity.js';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import mongoose from 'mongoose';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const adminJs = await configureAdminJs(app);

  configureSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // it converted string boolean to boolean
      transformOptions: { enableImplicitConversion: true, exposeDefaultValues: true },
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = +configService.get('PORT');

  await app.listen(PORT);

  console.log(`app is listeting on ${await app.getUrl()}`);

  console.log(`AdminJS started on http://localhost:${PORT}${adminJs.options.rootPath}`);
}
bootstrap();

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('nestjs http todo')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);
}

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

async function configureAdminJs(app: INestApplication) {
  const mongooseDb = await mongoose.connect(
    'mongodb://serhii:serhii_pass@localhost:27018/nestjs-http-todo?authMechanism=DEFAULT&authSource=admin',
  );

  const adminJs = new AdminJS({
    databases: [mongooseDb],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    },
  );
  app.use(adminJs.options.rootPath, adminRouter);

  return adminJs;
}
