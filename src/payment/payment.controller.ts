import { Controller, Get, Post, UseGuards, Req, Res, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAccessAuthGuard } from '../auth/jwt-access.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  /**
   * Dummy Checkout Route
   * @param req 
   * @returns {}
   */
  @UseGuards(JwtAccessAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post("/checkout")
  async checkout(@Req() req) {
    return this.paymentService.processCheckoutDummy(req.user);
  }

  /**
   * Get all transactions
   * @param req
   * @returns Transaction[]
  */
  @UseGuards(JwtAccessAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get("/transactions")
  async getAllTransactions(@Req() req) {
    // test endpoint
    return this.paymentService.getAllTransactions(req.user);
  }

  /**
   * Stripe Payment Callback
   * @param sessionId
   * @param res
  */
  @Get("stripe/callback")
  async stripePaymentCallback(@Query('session_id') sessionId: string, @Res() res) {
    if (!sessionId) {
      return res.status(400).send({ success: false, message: "Missing session_id" });
    }

    // user has entered 
    try {
      const res2 = await this.paymentService.handleStripeCallback(sessionId);
      return res.status(201).send(res2)
    } catch (e) {
      return res.status(400).send({ success: false, message: e.message });
    }


  }



}
