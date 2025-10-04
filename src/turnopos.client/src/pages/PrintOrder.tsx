import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import type Order from '../models/Order';
import orderService from '../services/OrderService';
import DepartmentsContext from '../contexts/DepartmentsContext';
import { formatCurrency, formatNumber } from '../utils/formatter'


const PrintOrder: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams()
    const departments = useContext(DepartmentsContext);

    const STATUS_CANCELLED = 2;

    useEffect(() => {
        const numberId = Number(id);
        if (!id || isNaN(numberId) || numberId < 1) return;

        setLoading(true);
        orderService.getById(+id)
            .then(data => setOrder(data))
            .finally(() => setLoading(false));
    }, []);

    const renderTitle = (!order || order.status == STATUS_CANCELLED) ?
        <h3>Orden Cancelada</h3> :
        <h3>Detalles de la orden</h3>

    const renderLines = (order && order.orderLines) ?
        order.orderLines.map(line => {
            return (<tr key={line.itemId}>
                <td>{line.quantity} <span className="print-visible">- </span></td>
                <td>{line.item?.name}</td>
                <td>{formatNumber(line.price)}</td>
                <td>{formatNumber(line.price * line.quantity)}</td>
            </tr>)
        })
        : null;

    const getDepartmentName = (id: number | null | undefined) =>
        id && departments.find(x => x.id == id)?.name || '';

    const calculateTotal = () =>
        (order?.orderLines.reduce((previous, current) => previous + current.total, 0)) || 0;

    const renderOrder = (
        <table>
            <thead>
                <tr>
                    <th><span className="print-invisible">Cantidad</span></th>
                    <th>Detalle</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {renderLines}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={3}>Total:</th>
                    <th>{formatCurrency(calculateTotal())}</th>
                </tr>
            </tfoot>
        </table>);

    const renderDepartments = () => {
        if (!order || !order.orderLines || !order.orderLines.length) return null;

        const lineCopy = [...order.orderLines];
        lineCopy.sort((a, b) => (a.item?.departmentId || 0) - (b.item?.departmentId || 0));

        let depId: number | null | undefined;
        const result: React.JSX.Element[] = [];
        for (const line of lineCopy) {

            if (!line.item) continue;
            const i = line.item;

            if (depId != i.departmentId) {
                depId = i.departmentId;
                result.push(<div key={'pg' + line.itemId} className="page-break"></div>);
                result.push(<h3 key={'dep' + line.itemId}>{getDepartmentName(i.departmentId)}</h3>)
            }
            result.push(<h4 key={'det' + line.itemId} >{line.quantity} - {i.name} </h4>)
        }

        return result;
    }


    return (
        <div className="print-order">
            {renderTitle}
            {renderOrder}
            {renderDepartments()}
        </div>
    );
}

export default PrintOrder;