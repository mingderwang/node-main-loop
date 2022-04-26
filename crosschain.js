import {
  Sdk,
  Env,
  EnvNames,
  MetaMaskWalletProvider,
  NetworkNames,
  sleep,
  randomPrivateKey,
} from "etherspot";
import "dotenv/config";
let xx = "Wait 🙉";

Env.defaultName = EnvNames.TestNets; // change this one for MainNets or TestNets

const PRIVATE_KEY = randomPrivateKey(); //process.env.PRIVATE_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const KEY_NETWORK = NetworkNames.Etherspot; // change this for different network, such as Ropsten
const RECEIVER = "0xE65B3A72e9d772Dd19719Dec92b1dE900fD178B0";

async function main() {
  let batchHash = "";
  const sdk = new Sdk(PRIVATE_KEY, {
    env: EnvNames.TestNets,
    networkName: KEY_NETWORK, // works for Ropsten too (with funds)
  });

  // step 0, init sdk and account
  sdk.notifications$.subscribe((notification) =>
    console.log("notification:🌈", notification)
  );

  // console.log("create session - token:🌦", (await sdk.createSession()).token);

  await sdk.syncAccount();
  await sdk.computeContractAccount({
    sync: true,
  });
  console.log("key account:🎒", sdk.state.account);
  // both need funding otherwise will reverted ********🍎🍎🍎🍎🍎🍎
  // p2pPaymentDepositAddress:🍎 0x92fa3E98958aFDf230C5a5795B62E950439d7f78
  // same contract account:🔥 0xEDb6fb28ae0eD17A3adc3283733391063e8D9fb6
  console.log(
    "p2pPaymentDepositAddress:🍎",
    sdk.state.state$._value.p2pPaymentDepositAddress
  );
  console.log("same contract account:🔥", sdk.state.account.address);

  // step 0 - clear batch
  await sdk.clearGatewayBatch();

  // step 0.1 - fundings contract address otherwise, tx will be reverted
  // only no Etherspot network
  if (KEY_NETWORK === NetworkNames.Etherspot) {
    await sdk
      .topUpAccount()
      .then((hash) => {
        console.log("funding - hash:🦊", hash);
      })
      .catch("🔥", console.error); // funding to new account
    await sdk
      .topUpPaymentDepositAccount()
      .then((hash) => {
        console.log("funding P2P Deposit - hash:🦊🦊", hash);
      })
      .catch("🔥", console.error); // funding to P2P Deposit account
  } else {
    console.log("balance:🐝", await sdk.getAccountBalances()); // balance will fail on Etherspot network
  }
  // test
  const sender = await sdk.getAccount();
  console.log("sender:", sender.address);
  const outputSS = await sdk.batchDeployAccount();
  console.log("-> gateway batch Sender", outputSS);

  /*
  balance:🐝 AccountBalances {
  items: [ AccountBalance { token: null, balance: [BigNumber] } ]
}
*/

  // add transaction to gateway batch
  // step 1 - batch native token for Tx
  /*
  await sdk.batchExecuteAccountTransaction({
    to: RECEIVER,
    value: 100, // 100 wei
  });
  // step 2 - estimate gas price for the whole batch queue
  await sdk
    .estimateGatewayBatch()
    .then(async (result) => {
      console.log("Estimation:🎯 ", result.estimation);

      try {
        // step 3 - if there is an estimated gas receive, then you can start to submit the whole batch.
        const batch = await sdk.submitGatewayBatch();
        console.log("Transaction submitted, batch:🎸 ", batch);
        batchHash = batch.hash;
        console.log("Transaction submitted, hash:🎸 ", batchHash);
      } catch (error) {
        console.log("💥", error);
      }
    })
    .catch((error) => {
      console.log(
        "Transaction estimation failed with error💥💥 ", // may have "reverted": "Transaction reverted", without enough funds, -> to use sdk.topUpAccount()
        error.message
      );
    });

    */
  // step 4.1 you will see Sent if the whole batch is sent.

  if (batchHash !== "") {
    while (xx !== "Sent") {
      await new Promise((r) => setTimeout(r, 2000));
      console.log(xx);
      sdk
        .getGatewaySubmittedBatch({
          hash: batchHash,
        })
        .then((x) => {
          console.log("🙉 batch process: ", x.state);
          xx = x.state;
        })
        .catch(console.error);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
