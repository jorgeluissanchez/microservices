import { Controller, All, Req, Res, HttpService } from '@nestjs/common';
import { Request, Response } from 'express';

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
      res.status(status).json(data);
    } catch (error) {
      const status = error.response?.status || 500;
      res.status(status).json(error.response?.data || { message: 'Auth service error' });
    }
  }
}
