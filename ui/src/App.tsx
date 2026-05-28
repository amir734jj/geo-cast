import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { Header, Main, Footer, JWT } from "./components/layout";
import { useThemeStore } from "./stores";
import { useEffect } from "react";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <JWT />
      <header>
        <Header />
      </header>
      <main>
        <Main>
          <Router />
        </Main>
      </main>
      <footer>
        <Footer />
      </footer>
    </BrowserRouter>
  );
}

export default App;
