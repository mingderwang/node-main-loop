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

Env.defaultName = EnvNames.TestNets;

//const PRIVATE_KEY = randomPrivateKey(); //process.env.PRIVATE_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const KEY_NETWORK = NetworkNames.Ropsten;
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
  /*
notification:🌈 AnyNotification {
  type: 'AccountMemberCreated',
  recipient: '0x452f9F4d5BEaB3A9C8Fe5a515C2C1937274A0Cf9',
  payload: {
    account: '0x452f9F4d5BEaB3A9C8Fe5a515C2C1937274A0Cf9',
    member: '0xFD8d1910D7D708BF465F6E365F91A2Bfdb3949AC'
  }
}
*/
  await sdk.syncAccount();
  console.log("synced contract account member", sdk.state.accountMember);
  /*
synced contract account member {
  type: 'Owner',
  state: 'Added',
  store: 'PersonalAccountRegistry',
  createdAt: 2022-04-26T06:37:00.676Z,
  updatedAt: 2022-04-26T06:37:00.676Z,
  synchronizedAt: 2022-04-26T06:37:01.432Z
}
*/
  console.log(
    "get account",
    await sdk.getAccount({
      address: sdk.state.accountAddress,
    })
  );
  /*
  get account Account {
  ensNode: null,
  address: '0x452f9F4d5BEaB3A9C8Fe5a515C2C1937274A0Cf9',
  type: 'Contract',
  state: 'UnDeployed',
  store: 'PersonalAccountRegistry',
  createdAt: 2022-04-26T06:37:00.651Z,
  updatedAt: 2022-04-26T06:37:00.651Z
}
*/
  console.log(
    "get account members",
    await sdk.getAccountMembers({
      account: sdk.state.accountAddress,
    })
  );
  /*
get account members AccountMembers {
  items: [
    AccountMember {
      member: [Account],
      type: 'Owner',
      state: 'Added',
      store: 'PersonalAccountRegistry',
      createdAt: 2022-04-26T06:37:00.676Z,
      updatedAt: 2022-04-26T06:37:00.676Z
    }
  ],
  currentPage: 1,
  nextPage: null
}
*/

  console.log(
    "p2pPaymentDepositAddress:🍎",
    sdk.state.state$._value.p2pPaymentDepositAddress
  );

  // step 0 - clear batch
  await sdk.clearGatewayBatch();

  console.log("same contract account:🔥", sdk.state.account.address);

  // top-up contract account (sdk.account.address)
  // step 0.1 - fundings contract address otherwise, tx will be reverted
  // only no Etherspot network
  if (KEY_NETWORK === NetworkNames.Etherspot) {
    console.log("balance:🐝", await sdk.getAccountBalances()); // balance will fail on Etherspot network
    const hash = await sdk.topUpAccount(); // funding to new account
    console.log("funding - hash:🦊", hash);
    const hash2 = await sdk.topUpPaymentDepositAccount(); // funding to P2P Deposit account
    console.log("funding P2P Deposit - hash:🦊", hash2);
  }

  // add transaction to gateway batch
  // step 1 - batch native token for Tx
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
