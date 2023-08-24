import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { MapsModule } from 'src/maps/maps.module';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { RoutesWebsocketGateway } from './routes-websocket/routes-websocket.gateway';
import { BullModule } from '@nestjs/bull';
import NewPointsConsumer from './new-points.consumer';

@Module({
  imports: [MapsModule, BullModule.registerQueue({ name: 'new-points' })],
  controllers: [RoutesController],
  providers: [
    RoutesService,
    RoutesDriverService,
    RoutesWebsocketGateway,
    NewPointsConsumer,
  ],
})
export class RoutesModule {}
