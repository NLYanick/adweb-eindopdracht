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