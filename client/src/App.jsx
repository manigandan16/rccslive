import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Rccs from './components/Rccs'
import Fw from './components/Fw'
// import ChartSwitcher from './components/charts'
import Uid from './components/Uid';
import Filter from './components/Filter';
import Ge from './components/Ge';
import Ee from './components/Ee';
import Pe from './components/Pe';
import Ie from './components/Ie';
import Os from './components/Os';
import Es from './components/Es';
import Nes from './components/Nes';
import Pro from './components/Pro';
import Ies from './components/Ies';
import Login from './components/Login';
import Intro from './components/Intro';
import UploadWithTeams from './components/UploadWithTeams';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rccs" element={<Rccs />} />  {/* Default route */}
        <Route path="/fw" element={<Fw />} />
        <Route path="/uid" element={<Uid/>} />
        <Route path="/filter" element={<Filter/>} />
        <Route path="/ge" element={<Ge/>} />
        <Route path="/ee" element={<Ee/>} />
        <Route path="/pe" element={<Pe/>} />
        <Route path="/ie" element={<Ie/>} />
        <Route path="/os" element={<Os/>} />
        <Route path="/es" element={<Es/>} />
        <Route path="/nes" element={<Nes/>} />
        <Route path="/pro" element={<Pro/>} />
        <Route path="/ies" element={<Ies/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/intro" element={<Intro/>} />
        <Route path="/up" element={<UploadWithTeams/>} />
      </Routes>
    </Router>
  );
}

export default App
