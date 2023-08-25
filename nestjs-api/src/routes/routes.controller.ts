import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { RouteSerializer } from './route.serializer';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // The decorator "Body" transforms the string from the body of the request into a JSON object.
  // Then the JSON object is converted into CreateRouteDto.
  @Post()
  async create(@Body() createRouteDto: CreateRouteDto) {
    const route = await this.routesService.create(createRouteDto);
    return new RouteSerializer(route);
  }

  @Get()
  async findAll() {
    const routes = await this.routesService.findAll();
    return routes.map((route) => new RouteSerializer(route));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const route = await this.routesService.findOne(id);
    return new RouteSerializer(route);
  }
}
