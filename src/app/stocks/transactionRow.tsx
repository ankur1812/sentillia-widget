export const TransactionRow = ({data = []}: any) => {
    let ts = new Date(data.timestamp).toISOString()
    return <>
        <tr>
            <td>{data.instrument_name} &nbsp;</td>
            <td>{data.amount} &nbsp;</td>
            <td>{data.price} &nbsp;</td>
            <td>{data.qty} &nbsp;</td>
            <td>{data.trade_id} &nbsp;</td>
            <td>{ts}</td>
        </tr>
</>
}