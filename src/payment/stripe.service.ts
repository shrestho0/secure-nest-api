import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2025-03-31.basil",
            typescript: true,
        });
    }


    async createDummyCheckoutSession(dummyOrderData) {

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: dummyOrderData.currency,
                        product_data: {
                            name: dummyOrderData.productName,
                            description: dummyOrderData.productDescription,
                        },
                        unit_amount: dummyOrderData.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: process.env.ORIGIN + "/payment/stripe/callback/?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: process.env.ORIGIN + "/payment/stripe/callback/?session_id={CHECKOUT_SESSION_ID}",
            metadata: {
                transaction_id: dummyOrderData.transaction_id,
                userId: dummyOrderData.user.id ?? "anonymous",
            },
        });

        return session.url;
    }

    async getSessionDetails(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return session;
    }

}