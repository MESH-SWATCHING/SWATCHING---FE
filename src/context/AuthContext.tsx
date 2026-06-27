import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as loginApi, signup as signupApi, getMe } from "../api/swatching";

interface User {
  userId: number;
  nickname: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 토큰 있으면 유저 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ data }) => setUser((data as any).data ?? data))
      .catch(() => {
        if (localStorage.getItem("accessToken") === token) {
          localStorage.removeItem("accessToken");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await loginApi({ email, password });
    const token = (data as any).data?.accessToken ?? (data as any).accessToken;
    localStorage.setItem("accessToken", token);
    const { data: userData } = await getMe();
    setUser((userData as any).data ?? userData);
  };

  const signup = async (email: string, password: string, nickname: string) => {
    await signupApi({ email, password, nickname });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 안에서 사용해야 합니다");
  return ctx;
}
