import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:8080'],
        credentials: true,
    });

    // Add session middleware
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'development-session-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60000 * 15, // 15 minutes (only used for OAuth flow)
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            },
        }),
    );

    // Global prefix for API routes
    app.setGlobalPrefix('api');

    // Validation pipe for DTO validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger API documentation setup
    const config = new DocumentBuilder()
        .setTitle('Event Hub API')
        .setDescription('The Event Hub API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start the application
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap(); 