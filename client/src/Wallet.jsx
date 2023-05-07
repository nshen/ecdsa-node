import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  privateKey,
  setPrivateKey,
  address,
  setAddress,
  balance,
  setBalance,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKeyBytes = secp256k1.getPublicKey(privateKey);
    // console.log("public: ", toHex(publicKeyBytes));
    function getAddress(publicKey) {
      const first = publicKey.slice(0, 1);
      return keccak256(publicKey.slice(1)).slice(-20);
    }

    // private key:  022cebf42a799ca5ea7eae1d24dfda21867634f21366dc50125ac593ab24ff4d
    // public key:  0472fc4655aa0f8b658efb9cbb6d105300148315d320d219c049acdcd7bb1317a9841624f8e
    // 8206bc1127cd5248806088ffe7ff574e2fd8d00e5751333877b98d4
    // public address:  0x009362d7811867295acf19f25dbb1cee9ef746a8
    const ethAddress = toHex(getAddress(publicKeyBytes));
    // console.log(ethAddress);
    const address = `0x${ethAddress}`;

    console.log("address: ", address);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet private key
        <input
          placeholder="Type an address, for example: 0x1"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
