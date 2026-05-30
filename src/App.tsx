import { useEffect } from 'react';
import { ThemeContext, useThemeProvider } from './hooks/useTheme';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Marquee } from './components/Marquee';

export default function App() {
  const themeCtx = useThemeProvider();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={themeCtx}>
      <div className="relative min-h-screen overflow-x-hidden">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Stats />
          <About />
          <Projects />
          <Blog />
          <Experience />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
