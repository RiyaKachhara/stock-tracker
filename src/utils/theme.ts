

export interface ThemeType {
  background: string;
  text: string;
  card: string;
  secondaryText: string;
  accent: string;
  border: string;
  isDark: boolean;
}

export const lightTheme: ThemeType = {
  background: '#fff',
  text: '#222',
  card: '#f9f9f9',
  secondaryText: '#666',
  accent: '#2e86de',
   border: '#ccc',
   isDark: false,
};

export const darkTheme: ThemeType = {
  background: '#121212',
  text: '#fff',
  card: '#1e1e1e',
  secondaryText: '#aaa',
  accent: '#2e86de',
  border: '#444',
  isDark: true,
};
