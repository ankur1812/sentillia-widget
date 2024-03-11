import { TransactionRow } from "./transactionRow";

export const TransactionList = ( {instrument, list}: any) => {
    let totalAmount = 0, totalQty = 0;
    list.forEach( (data: any) => {
        totalAmount += data.amount;
        totalQty += data.qty;
    })

    return <>
        <tr className="text-red-400">
            <td colSpan={4} className="pt-3"> {instrument} ** </td>
        </tr>
        {list.map( (row: any) => <TransactionRow data={row}></TransactionRow>)}
        <tr className="text-yellow-500">
            <td colSpan={4}>
                Aggregated
            </td>
        </tr>
        <tr className="text-yellow-500">
            <td> {instrument}</td>
            <td>{totalAmount}</td>
            <td className="text-xl22"> {(totalAmount / totalQty).toFixed(3)} (WeightedAvg)</td>
            <td>{totalQty}</td>
        </tr>
    </>
}