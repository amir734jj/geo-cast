import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { Header, Main, Footer, JWT } from "./components/layout";

function App() {
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
