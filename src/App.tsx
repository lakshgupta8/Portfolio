import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Work from './components/Work';
import Stack from './components/Stack';
import Path from './components/Path';
import About from './components/About';
import Contact from './components/Contact';
import { useReveal } from './hooks/useReveal';

function App() {
  useReveal();

  return (
    <div className="page">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Work />
        <Stack />
        <Path />
        <About />
      </main>
      <Contact />
    </div>
  );
}

export default App;
