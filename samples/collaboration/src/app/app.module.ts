import { Module } from '@nestjs/common';
import { NaetverkGateway } from './naetverk/naetverk.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [NaetverkGateway],
})
export class AppModule {}
