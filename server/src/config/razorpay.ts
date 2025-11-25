import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn("[Razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Razorpay client will not work until these are configured.");
}

export const razorpayClient = new Razorpay({
  key_id: keyId || "",
  key_secret: keySecret || "",
});
