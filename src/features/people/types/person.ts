export type Person = {
  id: number;
  name: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  employment: string;
  status: PersonStatus;
  photo: string;
};
export type PersonStatus = 'onboarding' | 'active' | 'offboarded';
