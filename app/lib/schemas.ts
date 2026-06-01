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
}