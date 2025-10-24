import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from '../controller/places.controller';
import { PlacesService } from '../../../application/service/places.service';
import { PlacesRepository } from '../../repository/places.repository';
import { Place, PlaceSchema } from '../../../domain/entity/place.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepository],
  exports: [PlacesService, PlacesRepository],
})
export class PlacesModule {}
