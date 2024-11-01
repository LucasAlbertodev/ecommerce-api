import axios from "axios";
import Buffer from " buffer";

class PayPal {
  constructor(clientId, clientSecret, sandbox = false, webhookId) {
    if (!clientId) throw new Error("Missing ClientId");
    if (!clientSecret) throw new Error("Missing ClientSecret");
    if (!webhookId) throw new Error("Missing webhookId");

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.webhookId = webhookId;

    this.api = sandbox
      ? "https://api-m.sandbox.paypal.com/"
      : "https://api.paypal.com/";

    this.axiosInstance = axios.create({
      baseURL: this.api,
      timeout: 10000,
    });
  }
  async getAccessToken() {
    try {
      const authHeader = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");
      const response = await this.axiosInstance.post(
        "v1/oauth/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error getting access token:",
        error.response?.data || error.message
      );
      throw new Error("Failed to get PayPal access token");
    }
  }
  async initialize() {
    try {
      const accessToken = await this.getAccessToken();
      //Create new axios instance with access token
      this.axiosInstance = axios.create({
        baseURL: this.api,
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return this
    } catch (error) {
        console.error('Error initializing PayPal client:', error.message);
        throw new Error('Failed to initialize PayPal client');
    }
  }
}
async function createPaypalClient({
  clientId,
  clientSecret,
  sandbox = false,
  webhookId,
}) {
  const client = new PayPal(clientId, clientSecret, sandbox, webhookId);
  await client.initialize();
  return client;
}

export default {createPaypalClient, PayPal}