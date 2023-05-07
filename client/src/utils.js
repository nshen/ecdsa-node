// const { secp256k1, sign } = require("ethereum-cryptography/secp256k1");
// const { keccak256 } = require("ethereum-cryptography/keccak");
// const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

const randomPrivateKeyHex = () => {
  return toHex(secp256k1.utils.randomPrivateKey());
};

const isValidPrivateKey = (privateKey) => {
  return secp256k1.utils.isValidPrivateKey(privateKey);
};

const getPublicKeyFromPrivateKey = (privateKey) => {
  return secp256k1.getPublicKey(privateKey);
};

const getPublicKeyHexFromPrivateKey = (privateKey) => {
  return toHex(getPublicKeyFromPrivateKey(privateKey));
};

const getAddress = (publicKey) => {
  const first = publicKey.slice(0, 1);
  const ethAddress = keccak256(publicKey.slice(1)).slice(-20);
  return "0x" + toHex(ethAddress);
};

const hashMessage = (message) => {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
};

const signMessage = (msg, privateKey) => {
  const hash = hashMessage(msg);
  return secp256k1.sign(hash, privateKey);
};

const recoverKey = (message, signatureCompactHex, recoveryBit) => {
  const hash = hashMessage(message);
  const sig =
    secp256k1.Signature.fromCompact(signatureCompactHex).addRecoveryBit(
      recoveryBit
    );
  return sig.recoverPublicKey(hash).toRawBytes();
};

const recoverAddress = (message, signatureCompactHex, recoveryBit) => {
  return getAddress(recoverKey(message, signatureCompactHex, recoveryBit));
};

export {
  toHex,
  randomPrivateKeyHex,
  isValidPrivateKey,
  getPublicKeyFromPrivateKey,
  getPublicKeyHexFromPrivateKey,
  getAddress,
  hashMessage,
  signMessage,
  recoverKey,
  recoverAddress,
};
