import type Item from './Item';
export default interface OrderLine {
    itemId: number;
    price: number;
    quantity: number;
    total: number;
    item?: Item;
}