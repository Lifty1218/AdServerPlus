const Payment = require("../models/payment");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// GET ALL PAYMENTS
const GetPayments = async (req, res) => {
  console.log("Get all payments");
  try {
    const payment = await Payment.find();
    return res.status(200).send(payment);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE PAYMENT
const GetPaymentByID = async (req, res) => {
  console.log("Get a single payment");
  try {
    const payment = await Payment.findById(req.params.id);
    return res.status(200).send(payment);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW PAYMENT
const CreatePayment = async (req, res) => {
  console.log("Create a payment");
  const payment = new Payment(req.body);
  try {
    await payment.save();
    return res.status(200).json(payment);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE PAYMENT
const UpdatePayment = async (req, res) => {
  console.log("Update a payment");

  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(payment);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE PAYMENT
const DeletePayment = async (req, res) => {
  console.log("Delete a payment");

  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    return res.status(200).json(payment);
  } catch (err) {
    return res.send(err);
  }
};

// CHECKOUT USING STRIPE
const Checkout = async (req, res) => {
  const { product, adId, stripeId } = req.body;
  const price = parseInt((req.body.price * 100).toFixed(0));
  console.log(product.description);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: product,
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: stripeId,
    success_url: `http://localhost:5173/advertiser/ads_new/checkout/success?adId=${adId}&product=${
      product.name
    }&price=${price / 100}`,
    cancel_url: "http://localhost:5173/advertiser/ads_new/checkout/failure",
  });
  //   res.redirect(303, session.url);
  res.json({ url: session.url });
};

// GET ALL PAYMENTS FOR A SPECIFIC ADVERTISER
const GetAdvertiserPayments = async (req, res) => {
  console.log("Get advertiser payments");
  try {
    // const token = await stripe.tokens.create({
    //   card: {
    //     number: "4000000000000077",
    //     exp_month: 12,
    //     exp_year: 2025,
    //     cvc: "123",
    //   },
    // });
    // await stripe.charges.create({
    //   amount: 50000,
    //   currency: "usd",
    //   source: token.id,
    // });
    const payment = await Payment.find({ advertiser: req.params.id });
    console.log(payment);
    return res.status(200).send(payment);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Server Error" });
  }
};

const TransferStripeFundsToPublisher = async (req, res) => {
  const { stripeId, publisherId, adSpaceId, product, amount } = req.body;
  console.log(req.body);
  const convertedAmount = parseInt((req.body.amount * 100).toFixed(0));
  try {
    await stripe.transfers.create({
      amount: convertedAmount,
      currency: "usd",
      destination: stripeId,
    });

    const payment = new Payment({
      publisher: publisherId,
      adSpace: adSpaceId,
      product: product,
      amount: amount.toFixed(2) + " $",
    });
    await payment.save();

    res.status(200).json({ message: "Transfer success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL ADVERTISER PAYMENTS
const GetAllAdvertiserPayments = async (req, res) => {
  console.log("Get all advertiser payments");
  try {
    const payment = await Payment.find({ advertiser: { $exists: true } });
    return res.status(200).send(payment);
  } catch (err) {
    return res.send(err);
  }
};

// GET ALL PUBLISHER PAYMENTS
const GetAllPublisherPayments = async (req, res) => {
  console.log("Get all publisher payments");
  try {
    const payment = await Payment.find({ publisher: { $exists: true } });
    return res.status(200).send(payment);
  } catch (err) {
    return res.send(err);
  }
};

// GET ALL PAYMENTS FOR A SPECIFIC PUBLISHER
const GetPublisherPayments = async (req, res) => {
  console.log("Get publisher payments");
  try {
    const payment = await Payment.find({ publisher: req.params.id });
    return res.status(200).send(payment);
  } catch (err) {
    return res.send(err);
  }
};

exports.GetPayments = GetPayments;
exports.GetPaymentByID = GetPaymentByID;
exports.CreatePayment = CreatePayment;
exports.UpdatePayment = UpdatePayment;
exports.DeletePayment = DeletePayment;

exports.Checkout = Checkout;
exports.GetAdvertiserPayments = GetAdvertiserPayments;
exports.GetPublisherPayments = GetPublisherPayments;
exports.TransferStripeFundsToPublisher = TransferStripeFundsToPublisher;
exports.GetAllAdvertiserPayments = GetAllAdvertiserPayments;
exports.GetAllPublisherPayments = GetAllPublisherPayments;
