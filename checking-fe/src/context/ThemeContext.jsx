import { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.body.style.backgroundColor = '#141414'; // Ant Design dark theme base
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.style.backgroundColor = '#f8fafc'; // Light theme base
      document.body.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const customTokens = isDarkMode 
    ? {
        colorPrimary: '#818cf8', // Lighter indigo for dark mode visibility
        colorBgBase: '#141414',
        borderRadius: 6,
      }
    : {
        colorPrimary: '#6366f1', // Indigo, professional looks
        colorBgContainer: '#ffffff',
        colorBgBase: '#f8fafc',
        borderRadius: 6,
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: customTokens,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
