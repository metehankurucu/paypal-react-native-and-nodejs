const express = require("express");
const router = express.Router();
const { client: paypalClient } = require("../helpers/paypalClient");
const paypal = require("@paypal/checkout-server-sdk");

//Edit these
const returnUrl = "http://localhost:3000/?result=true";
const cancelUrl = "http://localhost:3000/?result=false";

/* POST create an order */
router.post("/orders", async (req, res, next) => {
  try {
    const { currency_code, value } = req.body;
    if (!currency_code || !value)
      throw new Error(
        "Bad request. currency_code (string) and value (string) must be in the request body."
      );

    let client = paypalClient();

    // Construct a request object and set desired parameters
    // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      purchase_units: [
        {
          amount: {
            currency_code,
            value,
          },
        },
      ],
    });

    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Order: ${JSON.stringify(response.result)}`);

    // Open this url with webview in react native app
    const approvalUrl = response.result.links.find(
      (data) => data.rel == "approve"
    ).href;

    res.json({
      approvalUrl,
      returnUrl,
      cancelUrl,
      orderId: response.result.id,
      result: true,
    });
  } catch (error) {
    res.json({ error: error.message, result: false });
  }
});

/* POST capture the order */
router.post("/orders/:orderId/capture", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId)
      throw new Error(
        'Bad request. orderId not found, must be "/capture/orderId"'
      );

    let client = paypalClient();

    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);
    if (response.statusCode == 201) {
      res.json({
        result: true,
      });
    } else {
      throw new Error(JSON.stringify(response));
    }
  } catch (error) {
    res.json({ error: error.message, result: false });
  }
});

module.exports = router;
