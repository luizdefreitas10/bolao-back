import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  const config = new DocumentBuilder()
    .setTitle('Documentação Swagger - EDS-SCZL')
    .setDescription('Swagger to EDS-SCZL')
    .setVersion('1.0')
    .addServer('https://eds-sczl-api-production.up.railway.app/')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.enableCors({
    origin: ['http://localhost:3333'],
    methods: ['GET', 'POST'],
    credentials: true,
  })

  await app.listen(port)
}
bootstrap()
