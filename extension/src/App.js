import React from 'react'; 
import HomePage from "./Pages";
import SectionLinks from "./Configs/Routes/public.json"
import NavBar from "./Components/navbar";

import './Css/bootstrap.css';
import './Css/App.css';



function App() {
    return (
      <>
        <NavBar navs={SectionLinks} className="mb-5" />
        <HomePage/>
      </>
    );
}

export default App;
