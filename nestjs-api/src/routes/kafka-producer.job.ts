import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Processor('kafka-producer')
export default class RouteKafkaProducerJob {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  // TODO: Create type for this job.
  @Process()
  handle(job: Job<any>) {
    this.kafkaService.emit('route', job.data);
    return {};
  }
}
