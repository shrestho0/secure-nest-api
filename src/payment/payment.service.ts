import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus, User } from '@prisma/client';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentService {

  constructor(private readonly stripeService: StripeService, private readonly prismaService: PrismaService) { }


  async processCheckoutDummy(user: User) {

    // create dummy transaction
    const transaction = await this.prismaService.transaction.create({
      data: {
        userId: user.id,
        amount: 100,
        currency: "USD",
        status: TransactionStatus.PENDING,
        orderId: "dummy_order_id",
      } as any
    })



    // dummy order details
    const dummyOrder = {
      transaction_id: transaction.id,
      amount: 100,
      currency: "USD",
      productName: "Test Product",
      productDescription: "This is a test product",
      user: user,
    }

    // create checkout session
    const sessionUrl = await this.stripeService.createDummyCheckoutSession(dummyOrder);
    // return session url
    return {
      success: true,
      redirect: true,
      redirect_url: sessionUrl,
      message: "Checkout session created successfully",
    }


  }

  async handleStripeCallback(sessionId: string) {
    // get session details
    const session = await this.stripeService.getSessionDetails(sessionId);
    // console.log("DEBUG",session);

    if (!session) {
      throw new Error("Session not found");
    }

    const localTransactionId = session?.metadata?.transaction_id;
    if (!localTransactionId) {
      throw new Error("Transaction ID not found");
    }

    const dataToUpdate: Partial<Transaction> = {
      stripePaymentStatus: session.payment_status?.toString() ?? "",
      stripeSessionId: session.id,
      stripeCustomerEmail: session?.customer_details?.email ?? "",
      stripeCustomerName: session?.customer_details?.name ?? "",
      stripeCountry: session?.customer_details?.address?.country ?? "",
      stripePaymentIntentId: session?.payment_intent?.toString() ?? "",
      orderId: session?.metadata?.order_id ?? "",
      status: session.payment_status === "paid" ? TransactionStatus.SUCCEEDED : TransactionStatus.FAILED,

      presentmentAmount: session?.presentment_details?.presentment_amount,
      presentmentCurrency: session?.presentment_details?.presentment_currency,
    }

    // update transaction
    try {

      await this.prismaService.transaction.update({
        where: {
          id: localTransactionId,
        },
        data: dataToUpdate,
      })
    } catch (e) {
      throw new Error("Failed to update transaction. " + e.message);
    }

    // check payment status
    if (session.payment_status !== "paid") {
      throw new Error("Payment not successful");
    }


    return {
      success: true,
      message: "Payment successful",
    }
  }

  // process order
  getAllTransactions(user: User) {
    return this.prismaService.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }


}
