import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  // Handle specific events
  switch (event.type) {
    case "checkout.session.completed":
      if (session.mode === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        
        await prisma.subscription.create({
          data: {
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            planType: "premium",
          },
        });
      }
      break;
    case "invoice.payment_succeeded":
      if (session.billing_reason === "subscription_cycle") {
        const subscriptionId = session.subscription;
        
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
      break;
    case "customer.subscription.deleted":
      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: session.id,
        },
        data: {
          planType: "free",
          stripePriceId: "",
          stripeCurrentPeriodEnd: new Date(),
        },
      });
      break;
  }

  return NextResponse.json({ received: true });
}