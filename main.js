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

const PRIVATE_KEY = randomPrivateKey(); //process.env.PRIVATE_KEY;
const RECEIVER = "0xE65B3A72e9d772Dd19719Dec92b1dE900fD178B0";
async function main() {
  let batchHash = "";
  const sdk = new Sdk(PRIVATE_KEY, {
    env: EnvNames.TestNets,
    networkName: NetworkNames.Etherspot,
  });
  sdk.notifications$.subscribe((notification) =>
    console.log("notification:🌈", notification)
  );
  await sdk.syncAccount();

  await sdk.computeContractAccount({
    sync: true,
  });
  console.log("key account", sdk.state.account);

  console.log(
    "contract account",
    await sdk.computeContractAccount({
      sync: false,
    })
  );

  await sdk.syncAccount();
  console.log("synced contract account member", sdk.state.accountMember);

  console.log(
    "get account",
    await sdk.getAccount({
      address: sdk.state.accountAddress,
    })
  );
  console.log(
    "get account members",
    await sdk.getAccountMembers({
      account: sdk.state.accountAddress,
    })
  );

  const hash = await sdk.topUpAccount();
  batchHash = hash;
  console.log("transaction hash:🦊", hash);

  const { state } = sdk;
  console.log(
    "p2pPaymentDepositAddress:🍎",
    state.state$._value.p2pPaymentDepositAddress
  );

  sdk.notifications$.subscribe((notification) =>
    console.log("notification:🌈", notification)
  );

  console.log("create session - token:🌦", (await sdk.createSession()).token);
  await sdk.computeContractAccount({ sync: true });

  // step 0 - clear batch
  await sdk.clearGatewayBatch();

  const { account } = state;

  console.log("contract account:🔥", account.address);

  // top-up contract account (account.address)

  // add transaction to gateway batch
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
        "Transaction estimation failed with error💥💥 ",
        error.message
      );
    });

  // step 4.1 you will see Sent if the whole batch is sent.

  if (batchHash !== "") {
    while (xx !== "Sent") {
      await new Promise((r) => setTimeout(r, 2000));
      console.log(xx);
      console.log(batchHash);
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
