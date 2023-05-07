import { useState } from "react";
import server from "./server";
import { signMessage, recoverKey, getAddress, recoverAddress } from "./utils";

function Transfer({ privateKey, address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState(
    "0x25c4acef0a642b04439054d4da9fe74311c96de6"
  );

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };
    const transactionStr = JSON.stringify(transaction);
    let sig;

    try {
      sig = signMessage(transactionStr, privateKey);
    } catch (error) {
      console.log(error);
    }

    const msg = {
      sigHex: sig.toCompactHex(),
      sigRecovery: sig.recovery,
      transactionStr,
    };
    try {
      const {
        data: { balance },
      } = await server.post(`send`, msg);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
