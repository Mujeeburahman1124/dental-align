import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error Boundary to catch runtime crashes and show a meaningful message
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', fontFamily: 'sans-serif', padding: '20px'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '600px', width: '100%'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Something went wrong. Please try refreshing or logging in again.
            </p>
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
              padding: '16px', marginBottom: '20px', fontSize: '13px', color: '#dc2626',
              wordBreak: 'break-all', fontFamily: 'monospace'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                style={{
                  background: '#007AFF', color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: '8px', fontWeight: 700,
                  cursor: 'pointer', fontSize: '14px'
                }}
              >
                Clear & Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#f3f4f6', color: '#374151', border: 'none',
                  padding: '12px 24px', borderRadius: '8px', fontWeight: 700,
                  cursor: 'pointer', fontSize: '14px'
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
