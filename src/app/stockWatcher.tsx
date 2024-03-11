'use client';

import { useEffect, useState } from "react";

const TransactionRow = ({data = []}: any) => {
    // 
    return <>
          {/* {btcData.map( (data:any) =>  */}
        <tr>
            <td>{data.instrument_name} &nbsp;</td>
            <td>{data.amount} &nbsp;</td>
            <td>{data.price} &nbsp;</td>
            <td>{data.qty}</td>
        </tr>
      {/* )} */}
</>
}

const TransactionList = ( {instrument, list}: any) => {
    let totalAmount = 0, totalQty = 0;
    list.forEach( (data: any) => {
        totalAmount += data.amount;
        totalQty += data.qty;
    })

    return <>
        <tr>
            <td colSpan={4}> -- {instrument} -- </td>
        </tr>
        {list.map( (row: any) => <TransactionRow data={row}></TransactionRow>)}
        <tr>
            <td colSpan={4}>
                __Total__
            </td>
        </tr>
        <tr>
            <td> {instrument}</td>
            <td>{totalAmount}</td>
            <td> WeightedAvg : {totalAmount / totalQty} &nbsp;</td>
            <td>{totalQty}</td>
        </tr>
        <tr>
            &nbsp;
        </tr>
    </>
}

export const TransactionWatcher = () => {
    const [btcData, updateBtcData] = useState<any[]>([]);
    const [ computedPrices, updatePrices] = useState<any>({})
  // To subscribe to this channel:



  useEffect( () => {
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
        // debugger;
        let messageData = JSON.parse(e.data)?.params?.data;
        // messageData && updateBtcData([...btcData, ...messageData])
        if (messageData) {
            let newBtcData = [...btcData].concat(messageData);
            updateBtcData((btcData) => [...btcData, ...messageData]);
        }
        // updateBtcData([...btcData, e.data])
        // do something with the notifications...
        console.log("received from server : ", e.data);
      };
      ws.onopen = function () {
        ws.send(JSON.stringify(msg));
      };
        
  }, [])

  useEffect( () => {

    let instrumentHash: any = {};
    let computedData = btcData.map( data => ({
        ...data,
        qty: data.amount / data.price
    }))
    computedData.forEach( data => {
        if (!instrumentHash[data.instrument_name]) instrumentHash[data.instrument_name] = [data]
        else instrumentHash[data.instrument_name].push(data)
    })
    updatePrices(instrumentHash)
  }, [btcData])

  let instruments = Object.keys(computedPrices)
  debugger;
  
  return (
    <div>
      <h1> Current Trades / Transaction History </h1>
      <table>
        <tr>
            <td>INSTRUMENT</td>
            <td>Amount</td>
            <td>Price</td>
            <td>Qty</td>
        </tr>
      {instruments.map( ins => (
        <TransactionList instrument={ins} list={computedPrices[ins]}/>
      ))}
        
        {/* // computedPrices[ins].map( data => <TransactionRow btcData={data} ></TransactionRow>) */}
        </table>
    </div>
  );
};
