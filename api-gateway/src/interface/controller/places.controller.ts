import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity
} from '@nestjs/swagger';
import { CreatePlaceDto, UpdatePlaceDto, PlaceResponseDto } from '../dto/places.dto';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Create a new place',
    description: 'Create a new place/venue in the system (Admin only)'
  })
  @ApiBody({ type: CreatePlaceDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Place created successfully',
    type: PlaceResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - Admin role required' })
  @ApiResponse({ status: 409, description: 'Place with this name already exists' })
  @ApiSecurity('bearer')
  async createPlace(@Body() createPlaceDto: CreatePlaceDto, @CurrentUser() user: any, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PLACES_SERVICE_URL}/places`;
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders['content-length'];
    delete forwardHeaders['accept-encoding'];

    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'POST',
        url,
        data: createPlaceDto,
        headers: forwardHeaders,
        timeout: 5000
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Places service error' });
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all places',
    description: 'Retrieve all places with optional filtering (Available to all authenticated users)'
  })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'country', required: false, description: 'Filter by country' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'minCapacity', required: false, description: 'Minimum capacity filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiResponse({ 
    status: 200, 
    description: 'Places retrieved successfully',
    type: [PlaceResponseDto]
  })
  @ApiSecurity('bearer')
  async getPlaces(
    @Query() query: any,
    @Req() req: Request, 
    @Res() res: Response
  ) {
    const url = `${process.env.PLACES_SERVICE_URL}/places`;
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders['content-length'];
    delete forwardHeaders['accept-encoding'];

    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        params: query,
        headers: forwardHeaders,
        timeout: 5000
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Places service error' });
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get place by ID',
    description: 'Retrieve a specific place by its ID (Available to all authenticated users)'
  })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Place retrieved successfully',
    type: PlaceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  @ApiSecurity('bearer')
  async getPlaceById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PLACES_SERVICE_URL}/places/${id}`;
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders['content-length'];
    delete forwardHeaders['accept-encoding'];

    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        headers: forwardHeaders,
        timeout: 5000
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Places service error' });
    }
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Update place',
    description: 'Update an existing place (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiBody({ type: UpdatePlaceDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Place updated successfully',
    type: PlaceResponseDto
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - Admin role required' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  @ApiResponse({ status: 409, description: 'Place with this name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiSecurity('bearer')
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const url = `${process.env.PLACES_SERVICE_URL}/places/${id}`;
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders['content-length'];
    delete forwardHeaders['accept-encoding'];

    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'PATCH',
        url,
        data: updatePlaceDto,
        headers: forwardHeaders,
        timeout: 5000
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Places service error' });
    }
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete place',
    description: 'Delete a place from the system'
  })
  @ApiParam({ name: 'id', description: 'Place ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'Place deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async deletePlace(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PLACES_SERVICE_URL}/places/${id}`;
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders['content-length'];
    delete forwardHeaders['accept-encoding'];

    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'DELETE',
        url,
        headers: forwardHeaders,
        timeout: 5000
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Places service error' });
    }
  }
}
