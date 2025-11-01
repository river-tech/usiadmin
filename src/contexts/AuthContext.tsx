// import React, { createContext, useContext, useState, ReactNode } from 'react';

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   token?: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   login: (userData: AuthUser) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);

//   const login = (userData: AuthUser) => {
//     setUser(userData);
//     // Có thể thêm lưu localStorage nếu muốn
//   };

//   const logout = () => {
//     setUser(null);
//     // Có thể xóa localStorage nếu sử dụng
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
