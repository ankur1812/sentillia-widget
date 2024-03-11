export const TransactionRow = ({data = []}: any) => {
    return <>
        <tr>
            <td>{data.instrument_name} &nbsp;</td>
            <td>{data.amount} &nbsp;</td>
            <td>{data.price} &nbsp;</td>
            <td>{data.qty}</td>
        </tr>
</>
}