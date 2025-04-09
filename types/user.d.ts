interface InitialState {
  isAuth: boolean;
  loading: boolean;
  error: any;
  user: User;
}

interface User {
  access: string;
  email: string;
  id: string;
  full_name: string;
  date_joined: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  open_p_and_l: number;
  close_p_and_l: number;
  credit: number;
}
