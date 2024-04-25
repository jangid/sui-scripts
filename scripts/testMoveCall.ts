import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getExecStuff } from "./utils";
import * as dotenv from "dotenv";
dotenv.config();

const testMoveCall = async (amount: string | number) => {
  const { address, keypair, suiClient } = getExecStuff();
  const txb = new TransactionBlock();
  txb.setGasBudget(700000000);

  const amountInMist = BigInt(amount) * BigInt(1000000000);
  const [depositCoin] = txb.splitCoins(txb.gas, [amountInMist]);

  txb.moveCall({
    target: "0x2::transfer::public_transfer",
    typeArguments: ["0x2::coin::Coin<0x2::sui::SUI>"],
    arguments: [depositCoin, txb.pure(address, "address")],
  });

  // I know this can be achived using the following. But I am just testing moveCall.
  // txb.transferObjects([depositCoin], address);

  suiClient
    .signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((error) => {
      console.error(error);
    });
};

testMoveCall(2);
