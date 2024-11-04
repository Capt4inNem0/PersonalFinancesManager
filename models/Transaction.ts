
export interface TransactionCreateData {
    amount: number;
    description: string;
    journal_id: number;
}

export interface Transaction extends TransactionCreateData {
    id: number;
    create_date: Date;
}
