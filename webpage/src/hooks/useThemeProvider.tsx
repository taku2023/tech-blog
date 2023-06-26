import {
  ReactNode,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

type Theme  = 'light'|'dark'

type ThemeContextType = {
  theme: Theme,
  setTheme: Dispatch<SetStateAction<Theme>>
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: (_) => {},
})

interface Props {
  children: ReactNode
}
export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={{ theme,setTheme }}>
      <div id="theme" className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
