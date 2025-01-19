export interface IOneTimeExpense {
    _id?: string | null;
    name: string;
    description: string;
    amount: number;
    date_due: string;
    category: string;
  }  

  export interface IRecurringExpense {
    _id?: string | null;
    name: string; 
    description: string; 
    amount: number; 
    recurring_expense_id: string; 
    recurrence: {
      frequency: string; 
      start_date: string; 
      end_date: string;
    }
  }  