import { Job } from 'bull';
import { SocketPayload } from './routes-websocket/routes-websocket.gateway';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { Process, Processor } from '@nestjs/bull';

@Processor('new-points')
export default class NewPointsConsumer {
  constructor(private readonly routesDriverService: RoutesDriverService) {}

  @Process()
  async handle(job: Job<SocketPayload>) {
    await this.routesDriverService.createOrUpdate(job.data);
    return {};
  }
}
