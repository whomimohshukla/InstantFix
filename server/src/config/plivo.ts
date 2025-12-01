import * as plivo from "plivo";


// Load Plivo configuration from environment variables
const { PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN, PLIVO_SRC_NUMBER } = process.env;

export const plivoClient = new plivo.Client(
  PLIVO_AUTH_ID || "",
  PLIVO_AUTH_TOKEN || ""
);

export const plivoFrom = PLIVO_SRC_NUMBER || "INSTANTFIX";
