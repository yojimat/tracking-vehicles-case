import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

// This help us to run the app in a REPL session; debugging services without needing to run the whole application.
async function bootstrap() {
  await repl(AppModule);
}

bootstrap();
