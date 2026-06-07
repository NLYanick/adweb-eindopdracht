// Firebase has it's own User type, but this one extends it. Future proof :)
export type UserProfile = {
  uid: string;
  email: string;
  name: string;
}

export type Budgetbook = {
  uid: string;
  owner: string; // userUid
  name: string;
  description?: string;
  archived?: boolean;
  sharedWith?: string[]; // array of userUids
}

export type Transaction = {
  uid: string;
  budgetbook: string;
  amount: number; // negative = expense, positive = income
  description?: string;
  date: string;
  category?: string | null;// category uid
}

export enum CategoryType {
    Income = "income",
    Expense = "expense",
}

export type Category = {
    uid: string;
    budgetbook: string;
    type: CategoryType;
    name: string;
    budget: number;
    endDate?: string;
}