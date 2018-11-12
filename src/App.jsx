import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import { showContentMenus } from './routes/routes'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          { showContentMenus() }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
