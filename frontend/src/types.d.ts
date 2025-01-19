export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    weight: number;
    category_id: number;
    category: Category;
}

export interface OrderItem {
    quantity: number;
    product: Product;
}

export interface Order {
    id: number;
    approval_date: string | null;
    status: Status;
    username: string;
    items: OrderItem[];
    opinion: Opinion;
}

export interface Status {
    id: number;
    name: string;
}

export interface Opinion {
    id: number | null;
    order_id: number | null;
    rating: number | null;
    content: string | null;
}
