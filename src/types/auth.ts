export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; // Add this line
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}