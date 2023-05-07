const express = require("express");
const cors = require("cors");
const { recoverAddress } = require("./utils");
// import express from "express";
// import cors from "cors";
// import { recoverKey } from "./utils.mjs";
const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// private key:  2c9875f39be174ecb790da729c2ce44aeca6d7fdb80168921c29774e99821d67
// public key:  035d4bb55be8a5c2f41c98a1e22e9510221e69d71da6b849ccf674015c81bce391
// public address:  0x42b020e9bb30f24c214b19334a75c53950cc6050
//
// private key:  40c23249ef8bd16d23a5514ee00db26b7082d4850f7269371bad519edee73f34
// public key:  0295a2d23a5788c95d325157328e0edf8407e34fc57e8d42ea3f08e432dd6de97f
// public address:  0xc1e5f370c6b215d5326770264e53de3c7992955f
//
// private key:  853d4dc29e4d23c634054fc9b5776f967a6ed53a35ef88d16feae4d326ca96ae
// public key:  035976061cdfeb2e06bf6c77f328f384c483efa39c62bfa6ac7f3cfc86e81c3d18
// public address:  0x25c4acef0a642b04439054d4da9fe74311c96de6

const balances = {
  "0x42b020e9bb30f24c214b19334a75c53950cc6050": 100,
  "0xc1e5f370c6b215d5326770264e53de3c7992955f": 50,
  "0x25c4acef0a642b04439054d4da9fe74311c96de6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sigRecovery, sigHex, transactionStr } = req.body;
  const address2 = recoverAddress(transactionStr, sigHex, sigRecovery);
  const { sender, recipient, amount } = JSON.parse(transactionStr);
  if (sender === address2) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "address error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
