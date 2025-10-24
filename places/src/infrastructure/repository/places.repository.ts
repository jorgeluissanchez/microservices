import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from '../../domain/entity/place.entity';
import { CreatePlaceDto, UpdatePlaceDto } from '../../application/dto/place.dto';

@Injectable()
export class PlacesRepository {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const createdPlace = new this.placeModel(createPlaceDto);
    return createdPlace.save();
  }

  async findAll(): Promise<Place[]> {
    return this.placeModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Place | null> {
    return this.placeModel.findOne({ name }).exec();
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const updatedPlace = await this.placeModel
      .findByIdAndUpdate(id, updatePlaceDto, { new: true })
      .exec();
    return updatedPlace;
  }

  async delete(id: string): Promise<void> {
    await this.placeModel.findByIdAndDelete(id).exec();
  }

  async search(searchQuery: string): Promise<Place[]> {
    const regex = new RegExp(searchQuery, 'i');
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: regex },
              { description: regex },
              { city: regex },
              { country: regex },
              { address: regex },
            ],
          },
        ],
      })
      .exec();
  }

  async findByCity(city: string): Promise<Place[]> {
    const regex = new RegExp(city, 'i');
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          { city: regex },
        ],
      })
      .exec();
  }

  async findByCountry(country: string): Promise<Place[]> {
    const regex = new RegExp(country, 'i');
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          { country: regex },
        ],
      })
      .exec();
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Place[]> {
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          { pricePerDay: { $gte: minPrice, $lte: maxPrice } },
        ],
      })
      .exec();
  }

  async findByCapacity(minCapacity: number): Promise<Place[]> {
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          { capacity: { $gte: minCapacity } },
        ],
      })
      .exec();
  }

  async findByIds(ids: string[]): Promise<Place[]> {
    return this.placeModel
      .find({
        $and: [
          { isActive: true },
          { _id: { $in: ids } },
        ],
      })
      .exec();
  }

  async count(): Promise<number> {
    return this.placeModel.countDocuments({ isActive: true }).exec();
  }
}
