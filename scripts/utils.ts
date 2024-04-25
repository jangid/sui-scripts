import { fromB64 } from "@mysten/bcs";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

import * as dotenv from "dotenv";
dotenv.config();

export function getExecStuff() {
  if (!process.env.PK_B64) {
    throw new Error("env var PK_B64 not configured");
  }

  const b64PrivateKey = process.env.PK_B64 as string;
  const keypair = Ed25519Keypair.fromSecretKey(fromB64(b64PrivateKey).slice(1));
  const address = `${keypair.getPublicKey().toSuiAddress()}`;

  if (!process.env.NETWORK) {
    throw new Error("env var NETWORK not configured");
  }

  const suiClient = new SuiClient({
    url: getFullnodeUrl(
      process.env.NETWORK as "mainnet" | "testnet" | "devnet" | "localnet",
    ),
  });

  return { address, keypair, suiClient };
}
