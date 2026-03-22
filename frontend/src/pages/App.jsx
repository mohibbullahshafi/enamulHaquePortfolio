import React from 'react';
import './App.css';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Courses from './Courses';
import Consultancy from './Consultancy';

export default function App() {
  return (
    <div>
      <h1>Personal Portfolio</h1>
      <Home />
      <About />
      <Projects />
      <Courses />
      <Consultancy />
      <Contact />
    </div>
  );
}
