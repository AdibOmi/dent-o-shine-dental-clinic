import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LangProvider } from './i18n';
import { CONTACT, whatsappLink } from './data/content';
import './index.css';

/** If anything ever throws while rendering, show the clinic's contact details instead of a blank page. */
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error(error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="crash">
        <h1>Dent-O-Shine</h1>
        <p>Sorry, something went wrong loading this page. Please reload, or contact us directly:</p>
        <a className="btn btn-primary" href={`tel:${CONTACT.phoneTel}`}>
          Call {CONTACT.phoneDisplay}
        </a>
        <a className="btn btn-wa" href={whatsappLink()}>
          WhatsApp
        </a>
        <button className="btn btn-light" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LangProvider>
        <App />
      </LangProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
