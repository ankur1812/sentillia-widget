'use client';

import { useEffect, useState } from "react";
import { TransactionList } from "./transactionList";

export const TransactionWatcher = () => {
    const [txnData, updateTxnData] = useState<any[]>([]); // TxnData recieves the data from the websocket connection
    const [ txnDataHash, upadteTxnDataHash] = useState<any>({}) // TxnDataHash hashes the txnData no basis of instrument type

  useEffect( () => {
    if (window.subscribed) return;
    else (window.subscribed = true);
    // To subscribe to this channel:
    var msg = {
        jsonrpc: "2.0",
        method: "public/subscribe",
        id: 42,
        params: {
          channels: ["trades.future.BTC.100ms"],
        },
      };
      var ws = new WebSocket("wss://test.deribit.com/ws/api/v2");
      ws.onmessage = function (e) {
        let messageData = JSON.parse(e.data)?.params?.data;
        if (messageData) {
            updateTxnData((txnData) => [...txnData, ...messageData]);
        }
        // do something with the notifications...
        // console.log("received from server : ", e.data);
      };
      ws.onopen = function () {
        ws.send(JSON.stringify(msg));
      };
  }, [])

  useEffect( () => {
    // Whenever the txnData is computed, update the txnDataHash
    let instrumentHash: any = {};
    let computedData = txnData.map( data => ({
        ...data,
        qty: data.amount / data.price
    }))
    computedData.forEach( data => {
        if (!instrumentHash[data.instrument_name]) instrumentHash[data.instrument_name] = [data]
        else instrumentHash[data.instrument_name].push(data)
    })
    upadteTxnDataHash(instrumentHash)
  }, [txnData])
  let instruments = Object.keys(txnDataHash)

  return (
    <div>
      <h1 className="text-2xl mb-2"> Settled Trades / Transaction History </h1>
      <table>
        <tr>
            <td>INSTRUMENT</td>
            <td>Amount</td>
            <td>Price</td>
            <td>Qty</td>
            <td>Trade ID</td>
            <td>Timestamp</td>
        </tr>
        {instruments.map( ins => (
          <TransactionList instrument={ins} list={txnDataHash[ins]}/>
        ))}        
      </table>
    </div>
  );
};
