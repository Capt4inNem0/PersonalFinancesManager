
export interface JournalCreteData {
    name: string;
    closed: boolean;
}

export interface Journal extends JournalCreteData {
    id: number;
    create_date: Date;
}
