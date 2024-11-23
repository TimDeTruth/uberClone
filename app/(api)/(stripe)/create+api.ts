import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount, paymentMethodId } = body;

  if (!name || !email || !amount || !paymentMethodId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let customer;

  //check if customer exists
  const existingCustomer = await stripe.customers.list({ email });

  if (existingCustomer.data.length > 0) {
    customer = existingCustomer.data[0];
  } else {
    const newCustomer = await stripe.customers.create({
      name,
      email,
    });

    customer = newCustomer;
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-11-20.acacia" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "cad",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    })
  );

  //   return Response.json({
  //     paymentIntent: paymentIntent.client_secret,
  //     ephemeralKey: ephemeralKey.secret,
  //     customer: customer.id,
  //     publishableKey:
  //       "pk_test_51QO8Mm2LFwpkU952rZZeKkgedbNTRHWwxDIdEu7gXXjmhDz5Gqc4fcIK4UvJLOHkRLyDgm7FP5VrWcTKhMQR9qPM00GYjlkdNI",
  //   });
}

/* app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-11-20.acacia" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "eur",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51QO8Mm2LFwpkU952rZZeKkgedbNTRHWwxDIdEu7gXXjmhDz5Gqc4fcIK4UvJLOHkRLyDgm7FP5VrWcTKhMQR9qPM00GYjlkdNI",
  });
});
 */
