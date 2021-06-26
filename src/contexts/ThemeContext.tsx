import { ReactNode } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { createContext } from "react";

type ThemeType = {
  theme: string,
  setTheme: Dispatch<SetStateAction<string>>
}

type ThemeContextProps = {
  children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeType);

export const ThemeContextProvider = ({ children }: ThemeContextProps) => {
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
