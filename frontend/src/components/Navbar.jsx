import React from 'react';

export default function Navbar({ activeView, setActiveView, serverStatus }) {
  const isFallback = serverStatus?.fallbackMode;
  
  return (
    <nav className="glass-navbar">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActiveView('feed')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#fff',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-heading)'
          }}>
            Æ
          </div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: '800', 
            fontSize: '1.3rem',
            background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            AetherPress
          </span>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setActiveView('feed')}
            className={`btn ${activeView === 'feed' || activeView === 'read' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            Explore
          </button>
          
          <button 
            onClick={() => setActiveView('write')}
            className={`btn ${activeView === 'write' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            Write
          </button>

          <button 
            onClick={() => setActiveView('dashboard')}
            className={`btn ${activeView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            Dashboard
          </button>
        </div>

        {/* Database Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isFallback ? '#e11d48' : '#10b981',
            boxShadow: isFallback 
              ? '0 0 8px rgba(225, 29, 72, 0.6)' 
              : '0 0 8px rgba(16, 185, 129, 0.6)',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ 
            fontSize: '0.78rem', 
            color: isFallback ? '#fda4af' : '#a7f3d0', 
            fontWeight: '600',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isFallback ? 'In-Memory DB' : 'MongoDB Connected'}
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
    </nav>
  );
}
