import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const url = `${process.env.AUTH_SERVICE_URL}${req.url}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: req.method,
        url,
        data: req.body,
        headers: req.headers,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Auth service error' });
    }
    }
  }
