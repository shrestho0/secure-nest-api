import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, PrismaService],
})
export class PaymentModule { }
