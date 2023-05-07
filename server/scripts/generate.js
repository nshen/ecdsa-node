const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = toHex(secp256k1.utils.randomPrivateKey());

// 验证私钥是否有效
if (!secp256k1.utils.isValidPrivateKey(privateKey)) {
  throw new Error("Invalid private key");
}

console.log("private key: ", privateKey);

const publicKeyBytes = secp256k1.getPublicKey(privateKey);
const publicKey = toHex(publicKeyBytes);

console.log("public key: ", publicKey);

function getAddress(publicKey) {
  const first = publicKey.slice(0, 1);
  return keccak256(publicKey.slice(1)).slice(-20);
}
const ethAddress = toHex(getAddress(publicKeyBytes));
const ethAddressWithPrefix = `0x${ethAddress}`;

console.log("public address: ", ethAddressWithPrefix);
