import { Module } from '@nestjs/common';

import { AuthModule } from '@/interface/http/module/auth.module';
import { PaymentModule } from '@/interface/http/module/payment.module';

@Module({
  imports: [AuthModule, PaymentModule],
})
export class GatewayModule {}
