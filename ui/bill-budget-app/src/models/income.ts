export interface IOneTimeIncome {
    _id?: string | null;
    amount: number;
    date_received: string;
    description: string;
    source: string;
}

export interface IRecurrence {
    frequency: string; // e.g., 'weekly', 'bi-weekly', 'monthly', etc.
    start_date: string; // ISO string
    end_date: string; // ISO string
}

export interface IExpense {
    _id: string;
    user_id: string;
    name: string;
    description: string;
    amount: number;
    date_due: string; // ISO string
    type: string; // e.g., 'recurring'
    status: string; // e.g., 'paid', 'unpaid'
    recurring_expense_id: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    __v: number;
    recurrence: IRecurrence;
}

export interface IIncome {
    _id?: string;
    source: string; // e.g., 'salary', 'miscellaneous'
    description: string;
    date_received: string; // ISO string
    type: string; // e.g., 'recurring'
    recurring_income_id?: string;
    recurrence?: IRecurrence;
    amount: number;
}

export interface IBudgetData {
    _id: string;
    source: string; // e.g., 'salary'
    description: string;
    date_received: string; // ISO string
    type: string; // e.g., 'recurring'
    recurring_income_id: string;
    recurrence: IRecurrence;
    amount: number;
    additional_income: IIncome[];
    total_income: number;
    total_expenses: number;
    expenses: IExpense[];
    money_remaining: number;
}