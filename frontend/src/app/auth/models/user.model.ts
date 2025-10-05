export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  application_prefix?: string;
  roles?: string[];
  details?: any;
}

export const EMPTY_USER: User = {
  id: null,
  email: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  application_prefix: null
};
