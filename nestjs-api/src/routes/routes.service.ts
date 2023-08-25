import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class RoutesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly directionsService: DirectionsService,
    @InjectQueue('kafka-producer') private readonly kafkaProducerQueue: Queue,
  ) {}

  //TODO: Should verify if the route already exists instead of creating another one.
  async create(createRouteDto: CreateRouteDto) {
    const { request, available_travel_modes, geocoded_waypoints, routes } =
      await this.directionsService.getDirections(
        createRouteDto.source_id,
        createRouteDto.destination_id,
      );
    const legs = routes[0].legs[0];
    const routeCreated = await this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng,
          },
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng,
          },
        },
        distance: legs.distance.value,
        duration: legs.duration.value,
        directions: JSON.stringify({
          request,
          available_travel_modes,
          geocoded_waypoints,
          routes,
        }),
      },
    });
    await this.kafkaProducerQueue.add({
      event: 'RouteCreated',
      id: routeCreated.id,
      name: routeCreated.name,
      distance: routeCreated.distance,
    });
    return routeCreated;
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findUnique({
      where: {
        id: id,
      },
    });
  }
}
