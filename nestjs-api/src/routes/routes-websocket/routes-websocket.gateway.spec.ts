import { Test, TestingModule } from '@nestjs/testing';
import { RoutesWebsocketGateway } from './routes-websocket.gateway';

describe('RoutesWebsocketGateway', () => {
  let gateway: RoutesWebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesWebsocketGateway],
    }).compile();

    gateway = module.get<RoutesWebsocketGateway>(RoutesWebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
