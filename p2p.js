/**
 * User Wallets
 * - Network: Ropsten
 * - const sdk
 *
 * - Network: Ropsten
 * - const rcv
 */
import "dotenv/config";

import {
  Sdk,
  Env,
  EnvNames,
  MetaMaskWalletProvider,
  NetworkNames,
  sleep,
  randomPrivateKey,
} from "etherspot";
import { utils } from "ethers";

Env.defaultName = EnvNames.TestNets; // change this one for MainNets or TestNets

const privateKeyA = randomPrivateKey(); //process.env.PRIVATE_KEY;
const privateKeyB = randomPrivateKey(); //process.env.PRIVATE_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CURREYT_NETWORK = NetworkNames.Etherspot; // change this for different network, such as Ropsten
const RECEIVER = "0xE65B3A72e9d772Dd19719Dec92b1dE900fD178B0";

async function main() {
  const logDeposits = async () => {
    sdk.getP2PPaymentDeposits().then((x) => {
      console.log(
        "-> 🚄 (sender) getP2pPDeposits.0.availableAmount",
        utils.formatUnits(x.items[0].availableAmount.toString(), 18)
      );
      console.log(
        "lockedAmount",
        utils.formatUnits(x.items[0].lockedAmount.toString(), 18)
      );
      console.log(
        "pendingAmount",
        utils.formatUnits(x.items[0].pendingAmount.toString(), 18)
      );
      if (x.items[0].latestWithdrawal) {
        console.log(
          "latestWithdrawal.value",
          utils.formatUnits(x.items[0].latestWithdrawal.value.toString(), 18)
        );
        console.log(
          "latestWithdrawal.totalAmount",
          utils.formatUnits(
            x.items[0].latestWithdrawal.totalAmount.toString(),
            18
          )
        );
      }
      console.log(
        "totalAmount",
        utils.formatUnits(x.items[0].totalAmount.toString(), 18)
      );
      console.log(
        "withdrawAmount",
        utils.formatUnits(x.items[0].withdrawAmount.toString(), 18)
      );
    });
    rcv.getP2PPaymentDeposits().then((x) => {
      console.log("items size:", x.items.length);
      console.log(
        "-> 🚄 (reciver) getP2pPDeposits.0.availableAmount",
        utils.formatUnits(x.items[0].availableAmount.toString(), 18)
      );
      console.log(
        "lockedAmount",
        utils.formatUnits(x.items[0].lockedAmount.toString(), 18)
      );
      console.log(
        "pendingAmount",
        utils.formatUnits(x.items[0].pendingAmount.toString(), 18)
      );
      if (x.items[0].latestWithdrawal) {
        console.log(
          "latestWithdrawal.value",
          utils.formatUnits(x.items[0].latestWithdrawal.value.toString(), 18)
        );
        console.log(
          "latestWithdrawal.totalAmount",
          utils.formatUnits(
            x.items[0].latestWithdrawal.totalAmount.toString(),
            18
          )
        );
      }
      console.log(
        "totalAmount",
        utils.formatUnits(x.items[0].totalAmount.toString(), 18)
      );
      console.log(
        "withdrawAmount",
        utils.formatUnits(x.items[0].withdrawAmount.toString(), 18)
      );
    });
  };

  let batchHash = "";
  const sdk = new Sdk(privateKeyA, {
    networkName: CURREYT_NETWORK,
    projectKey: "a-key",
  });
  const rcv = new Sdk(privateKeyB, {
    networkName: CURREYT_NETWORK,
    projectKey: "a-key",
  });

  // step 0, init sdk and account
  sdk.notifications$.subscribe((notification) => {
    console.log("notification:🌈 sender:", notification.type);
    if (notification.type === "P2PPaymentDepositUpdated") {
      logDeposits();
    }
  });
  rcv.notifications$.subscribe((notification) => {
    console.log("notification:🌈🌈 receiver:", notification.type);
    if (notification.type === "P2PPaymentDepositUpdated") {
      logDeposits();
    }
  });

  // console.log("create session - token:🌦", (await sdk.createSession()).token);

  await sdk.syncAccount();
  await sdk.computeContractAccount({
    sync: true,
  });
  console.log("sender account:🎒", sdk.state.account.address);
  await rcv.syncAccount();
  await rcv.computeContractAccount({
    sync: true,
  });
  console.log("receiver account:🎒", rcv.state.account.address);
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
  if (CURREYT_NETWORK === NetworkNames.Etherspot) {
    await sdk
      .topUpAccount()
      .then((hash) => {
        console.log("funding sender - hash:🦊", hash);
      })
      .catch("🔥", console.error); // funding to new account
    await rcv
      .topUpAccount()
      .then((hash) => {
        console.log("funding receiver - hash:🦊", hash);
      })
      .catch("🔥", console.error); // funding to new account
    await sdk
      .topUpPaymentDepositAccount()
      .then((hash) => {
        console.log("funding sender P2P Deposit - hash:🦊🦊", hash);
      })
      .catch("🔥", console.error); // funding to P2P Deposit account
    await rcv
      .topUpPaymentDepositAccount()
      .then((hash) => {
        console.log("funding receiver P2P Deposit - hash:🦊🦊", hash);
      })
      .catch("🔥", console.error); // funding to P2P Deposit account
  } else {
    console.log("balance:🐝", await sdk.getAccountBalances()); // balance will fail on Etherspot network
  }
  // test
  const sender = await sdk.getAccount();
  console.log("sender:", sender.address);
  //const outputSS = await sdk.batchDeployAccount();
  //console.log("-> gateway batch Sender", outputSS);

  /**
   * We're going to set 1 ETH as amount to be transferred.
   */
  const amountToSend = utils.parseEther("0.8");

  const output = await sdk
    .updateP2PPaymentChannel({
      recipient: rcv.state.accountAddress,
      totalAmount: amountToSend,
    })
    .catch("send fails:❌", console.error);

  // This is the hash we will use in the next step.
  console.log("updateP2PPaymentChannel - hash:💥", output.hash);

  /*
   * Remember to clear your batch and keep the house clean!
   */
  await rcv.clearGatewayBatch();

  /**
   * Next, commit the Payment Channel. The
   * batchCommitP2PPaymentChannel takes an object with two
   * properties:
   * - hash: the previously created Payment channel hash
   * - deposit:
   * - - true: the exchange amount is transferred to the p2pDepositAddress.
   * - - false: the exchange amount is transferred to the accountAddress
   */
  await rcv
    .batchCommitP2PPaymentChannel({
      hash: output.hash,
      deposit: true, // See notes above
    })
    .catch("batch P2P recevie fail:❌", console.error);

  /**
   * Next, we estimate the cost of the transaction...
   */
  await rcv.estimateGatewayBatch();

  /**
   * And finally we submit this to the ETherspot Gateway.
   */
  await rcv.submitGatewayBatch();

  logDeposits();
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

  let xx = "Wait 🙉";
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
