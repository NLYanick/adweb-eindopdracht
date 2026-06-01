export type User = {
  uid: string;
  email: string;
  name: string;
  password: string;
}

export type Budgetbook = {
  uid: string;
  owner: string; // userUid
  name: string;
  description?: string;
}