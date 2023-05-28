import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { Header, Main, Footer } from "./components/layout";

function App() {
  return (
    <BrowserRouter>
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
  )
}

export default App
