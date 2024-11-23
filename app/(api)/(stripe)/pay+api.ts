import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_method_id, payment_intent_id, customer_id, client_secret } =
      body;

    if (
      !payment_method_id ||
      !payment_intent_id ||
      !customer_id ||
      !client_secret
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //create a payment
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer: customer_id,
      }
    );

    const paymentResult = await stripe.paymentIntents.confirm(
      payment_intent_id,
      {
        payment_method: payment_method_id,
      }
    );

    return Response.json(paymentResult);

    //   return new Response(JSON.stringify({
    //       success: true,
    //       message: "Payment successful",
    //       result: paymentResult,
    //     }),
    //     { status: 200 }
    //   );
  } catch (error) {
    console.error("Error confirming payment:", error);
    return Response.json(
      { error: "Payment confirmation failed" },
      { status: 500 }
    );
  }
}
