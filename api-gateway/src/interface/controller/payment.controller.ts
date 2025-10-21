import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Controller('payment')
export class PaymentController {
  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}${req.url}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: req.method,
        url,
        data: req.body,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
  }
}
