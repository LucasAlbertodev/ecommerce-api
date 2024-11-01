import axios from "axios";
import dotenv from "dotenv";
import createPaypalClient from "../utils/paypal";

dotenv.config();

// Verify PayPal webhook signature
async function verifyWebhookSignature(headers, body) {
  try {
    const paypal = await createPaypalClient({
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      sandbox: true,
    });

    // const body = req.body;
    // if (!body) {
    // return res
    // .status(400)
    // .json({ message: "No data received", error: "Missing body" });
    // }

    const webhookHeaders = {
      auth_algo: req.headers["paypal-auth-algo"],
      cert_url: req.headers["paypal-cert-url"],
      transmission_id: req.headers["paypal-transmission-id"],
      transmission_sig: req.headers["paypal-transmission-sig"],
      transmission_time: req.headers["paypal-transmission-time"],
    };

    const missingHeaders = Object.entries(webhookHeaders)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingHeaders.length) {
      throw new Error(
        `Missing required PayPal headers: ${missingHeaders.join(", ")}`
      );
    }

    //verify signature with paypal
    const response = await paypal.request(
      "POST",
      "/v1/notifications/verify-webhook-signature",
      {
        ...webhookHeaders,
        webhookId: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }
    );
    return response.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}

//handle Approved orders

async function handleApprovedOrder(order) {
  try {
    // Process the order and send email or update database
    console.log("Received approved order:", order.resource.id);
    //TODO
    // Send email to customer
    // Send email to admin
    // Send email to warehouse manager
    // Update inventory
    // Send shipping notification to customer
    // Send shipping notification to warehouse manager
    // Update database with order details
    return true
  } catch (error) {
    console.error("Error handling approved order:", error);
    throw error;
  }
}

//main function to handlew webhook
async function handleWebhook(headers, body) {
  try {
    const isVerified = await verifyWebhookSignature(headers,body);
    if (!isVerified) {
      throw new Error("Invalid webhook signature");
    };

    
  } catch (error) {
    
    
  }
}