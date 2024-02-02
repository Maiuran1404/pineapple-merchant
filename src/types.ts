export type TOrder = {
    id: string;
    status: string;
    buyerName: string;
    purchaseTime: { toDate: () => Date };
    products: {
      name: string;
      options?: Record<string, string>;
    }[];
}