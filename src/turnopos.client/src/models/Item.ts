import type Department from "./Department";

export default interface Item {
    id: number;
    isDirectory: boolean;
    parentId?: number | null;
    departmentId?: number | null;
    name: string;
    description?: string;
    price?: number;
    stock?: number;
    order?: number;
    isActive: boolean;
    parent?: Item | null;
    department?: Department | null;
    children?: Item[];
    childrenLoaded: boolean;
}