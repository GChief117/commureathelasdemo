// src/App.js
// -----------------------------------------------------------------------------
// <App/> – global theme + permitting (RCM) context + layout
// -----------------------------------------------------------------------------
import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Header        from './components/Header';
import PermitFilters from './components/PermitFilters';
import PermitTabs    from './components/PermitTabs';
import PermitChatbot from './components/PermitChatbot';
import Footer        from './components/Footer';
import './App.css';   // ensure .app-container, .filters-row, .main-grid styles

export const PermitContext = React.createContext();

export default function App() {
  const [filters, setFilters] = React.useState({
    practice:     'North Valley Hospital',       
    payer:        'Aetna',
    claimStatus:  'Submitted',       
    denialReason: 'None',   
    phase:        0        
  });

  return (
    <FluentProvider theme={webLightTheme}>
      <PermitContext.Provider value={{ filters, setFilters }}>
        <div className="app-container">
          <Header />

          {/* Filters row */}
          <div className="filters-row">
            <PermitFilters />
          </div>

          {/* Main two-column area: tabs + chatbot */}
          <main className="main-grid">
            <PermitTabs />
            <PermitChatbot />
          </main>

          <Footer />
        </div>
      </PermitContext.Provider>
    </FluentProvider>
  );
}
