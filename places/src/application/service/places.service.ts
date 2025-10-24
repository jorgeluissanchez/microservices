import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PlacesRepository } from '../../infrastructure/repository/places.repository';
import { CreatePlaceDto, UpdatePlaceDto, PlaceResponseDto } from '../dto/place.dto';
import { Place } from '../../domain/entity/place.entity';

@Injectable()
export class PlacesService {
  constructor(private readonly placesRepository: PlacesRepository) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    // Check if place with same name already exists
    const existingPlace = await this.placesRepository.findByName(createPlaceDto.name);
    if (existingPlace) {
      throw new ConflictException('Place with this name already exists');
    }

    const place = await this.placesRepository.create(createPlaceDto);
    return this.mapToResponseDto(place);
  }

  async findAll(): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.findAll();
    return places.map(place => this.mapToResponseDto(place));
  }

  async findOne(id: string): Promise<PlaceResponseDto> {
    const place = await this.placesRepository.findById(id);
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    return this.mapToResponseDto(place);
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<PlaceResponseDto> {
    const existingPlace = await this.placesRepository.findById(id);
    if (!existingPlace) {
      throw new NotFoundException('Place not found');
    }

    // Check if name is being updated and if it conflicts with existing place
    if (updatePlaceDto.name && updatePlaceDto.name !== existingPlace.name) {
      const placeWithSameName = await this.placesRepository.findByName(updatePlaceDto.name);
      if (placeWithSameName) {
        throw new ConflictException('Place with this name already exists');
      }
    }

    const updatedPlace = await this.placesRepository.update(id, updatePlaceDto);
    return this.mapToResponseDto(updatedPlace);
  }

  async remove(id: string): Promise<void> {
    const place = await this.placesRepository.findById(id);
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    await this.placesRepository.delete(id);
  }

  async searchPlaces(searchQuery: string): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.search(searchQuery);
    return places.map(place => this.mapToResponseDto(place));
  }

  async findByCity(city: string): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.findByCity(city);
    return places.map(place => this.mapToResponseDto(place));
  }

  async findByCountry(country: string): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.findByCountry(country);
    return places.map(place => this.mapToResponseDto(place));
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.findByPriceRange(minPrice, maxPrice);
    return places.map(place => this.mapToResponseDto(place));
  }

  async findByCapacity(minCapacity: number): Promise<PlaceResponseDto[]> {
    const places = await this.placesRepository.findByCapacity(minCapacity);
    return places.map(place => this.mapToResponseDto(place));
  }

  private mapToResponseDto(place: Place): PlaceResponseDto {
    return {
      _id: place._id.toString(),
      name: place.name,
      description: place.description,
      address: place.address,
      city: place.city,
      country: place.country,
      capacity: place.capacity,
      pricePerDay: place.pricePerDay,
      amenities: place.amenities || [],
      images: place.images || [],
      isActive: place.isActive,
      rating: place.rating,
      reviewCount: place.reviewCount,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt,
    };
  }
}
