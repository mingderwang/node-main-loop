# node-main-loop
node-main-loop (don't steal my $$$)

# run

```sh
yarn 
yarn start
```

# demo

```sh
➜  node-main-loop git:(main) yarn start
yarn run v1.22.15
$ node p2p.js
notification:🌈 sender: AccountMemberCreated
sender account:🎒 0xB34D2AC355a6D390eb1977F439eAED2CC6235D74
notification:🌈🌈 receiver: AccountMemberCreated
receiver account:🎒 0x90811c19Ad8ae490Be3A03AfCe9Db4000f08cc99
p2pPaymentDepositAddress:🍎 0x66f869250948B3bd0FFab645Cd6BE22521aD2BC5
same contract account:🔥 0xB34D2AC355a6D390eb1977F439eAED2CC6235D74
funding sender - hash:🦊 0xd45e64692198e407ca159d8ab36e16ff45b4e2bbe1dd66b50aa4dd127cc47882
funding receiver - hash:🦊 0x422408fd796a29a7ac02cc70c40202e16e0c41c47fcd728220350dd4f30a0008
funding sender P2P Deposit - hash:🦊🦊 0x6da3fb07de6a3f40a112c00993d32240fa44315d099e0309ebe073bd799cf726
funding receiver P2P Deposit - hash:🦊🦊 0x56dd6c62b2023e36a43cd1475bcb2e1033aaa8ca20ad7c0ffb3e229711825f59
sender: 0xB34D2AC355a6D390eb1977F439eAED2CC6235D74
notification:🌈🌈 receiver: P2PPaymentChannelCreated
notification:🌈 sender: P2PPaymentChannelCreated
notification:🌈 sender: P2PPaymentDepositCreated
notification:🌈 sender: P2PPaymentDepositUpdated
notification:🌈🌈 receiver: P2PPaymentChannelUpdated
notification:🌈🌈 receiver: P2PPaymentDepositCreated
notification:🌈 sender: P2PPaymentChannelUpdated
notification:🌈🌈 receiver: P2PPaymentDepositUpdated
updateP2PPaymentChannel - hash:💥 0x71128203ff7fb3c707a664b9189c3aa553266943097b14f70c4a25183056fe0e
-> 🚄 (sender) getP2pPDeposits.0.availableAmount 0.2
lockedAmount 0.8
pendingAmount 0.0
totalAmount 1.0
withdrawAmount 0.0
items size: 1
-> 🚄 (reciver) getP2pPDeposits.0.availableAmount 1.0
lockedAmount 0.0
pendingAmount 0.8
totalAmount 1.0
withdrawAmount 0.0
items size: 1
-> 🚄 (reciver) getP2pPDeposits.0.availableAmount 1.0
lockedAmount 0.0
pendingAmount 0.8
totalAmount 1.0
withdrawAmount 0.0
-> 🚄 (sender) getP2pPDeposits.0.availableAmount 0.2
lockedAmount 0.8
pendingAmount 0.0
totalAmount 1.0
withdrawAmount 0.0
notification:🌈🌈 receiver: GatewayBatchCreated
gas info GatewayGasInfo {
  standard: BigNumber { _hex: '0x0ba43b7400', _isBigNumber: true },
  fast: BigNumber { _hex: '0x0ba43b7400', _isBigNumber: true },
  instant: BigNumber { _hex: '0x0ba43b7400', _isBigNumber: true }
}
Transactions:🐝🐝🐝 Transactions { items: [] }
✨  Done in 26.23s.
```

