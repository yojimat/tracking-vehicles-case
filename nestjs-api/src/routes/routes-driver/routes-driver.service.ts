import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class RoutesDriverService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('kafka-producer') private readonly kafkaProducerQueue: Queue,
    @InjectMetric('route_started_counter')
    private readonly routeStartedCounter: Counter,
    @InjectMetric('route_finished_counter')
    private readonly routeFinishedCounter: Counter,
  ) {}

  async createOrUpdate(dto: { route_id: string; lat: number; lng: number }) {
    const { route_id, lat, lng } = dto;

    const countRouteDriver = await this.prismaService.routeDriver.count({
      where: {
        route_id: route_id,
      },
    });

    const routeDriver = await this.prismaService.routeDriver.upsert({
      include: {
        route: true,
      },
      where: {
        route_id: route_id,
      },
      create: {
        route_id: route_id,
        points: {
          set: {
            location: {
              lat: lat,
              lng: lng,
            },
          },
        },
      },
      update: {
        points: {
          push: {
            location: {
              lat: lat,
              lng: lng,
            },
          },
        },
      },
    });

    // TODO: Refactor this logic into some function, for better readability and maintainability.
    if (countRouteDriver === 0) {
      await this.kafkaProducerQueue.add({
        event: 'RouteStarted',
        id: route_id,
        name: routeDriver.route.name,
        started_at: new Date().toISOString(),
      });
      this.routeStartedCounter.inc();
      return routeDriver;
    }

    const directions: DirectionsResponseData = JSON.parse(
      routeDriver.route.directions as string,
    );

    const lasPoint =
      directions.routes[0].legs[0].steps[
        directions.routes[0].legs[0].steps.length - 1
      ].end_location;

    if (lasPoint.lat === lat && lasPoint.lng === lng) {
      await this.kafkaProducerQueue.add({
        event: 'RouteFinished',
        id: route_id,
        name: routeDriver.route.name,
        finished_at: new Date().toISOString(),
        lat: lat,
        lng: lng,
      });
      this.routeFinishedCounter.inc();
      return routeDriver;
    }

    await this.kafkaProducerQueue.add({
      event: 'DriverMoved',
      id: route_id,
      name: routeDriver.route.name,
      lat: lat,
      lng: lng,
    });
    return routeDriver;
  }
}
