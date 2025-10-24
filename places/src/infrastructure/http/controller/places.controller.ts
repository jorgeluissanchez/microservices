import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PlacesService } from '../../../application/service/places.service';
import { CreatePlaceDto, UpdatePlaceDto, PlaceResponseDto } from '../../../application/dto/place.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({
    status: 201,
    description: 'Place created successfully',
    type: PlaceResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Place with this name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'country', required: false, description: 'Filter by country' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'minCapacity', required: false, description: 'Minimum capacity filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiResponse({
    status: 200,
    description: 'Places retrieved successfully',
    type: [PlaceResponseDto],
  })
  async findAll(
    @Query('city') city?: string,
    @Query('country') country?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minCapacity') minCapacity?: string,
    @Query('search') search?: string,
  ): Promise<PlaceResponseDto[]> {
    if (search) {
      return this.placesService.searchPlaces(search);
    }
    
    if (city) {
      return this.placesService.findByCity(city);
    }
    
    if (country) {
      return this.placesService.findByCountry(country);
    }
    
    if (minPrice && maxPrice) {
      return this.placesService.findByPriceRange(
        parseInt(minPrice),
        parseInt(maxPrice)
      );
    }
    
    if (minCapacity) {
      return this.placesService.findByCapacity(parseInt(minCapacity));
    }
    
    return this.placesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Place retrieved successfully',
    type: PlaceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async findOne(@Param('id') id: string): Promise<PlaceResponseDto> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a place' })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiResponse({
    status: 200,
    description: 'Place updated successfully',
    type: PlaceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  @ApiResponse({ status: 409, description: 'Place with this name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<PlaceResponseDto> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place' })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiResponse({ status: 204, description: 'Place deleted successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.placesService.remove(id);
  }
}
