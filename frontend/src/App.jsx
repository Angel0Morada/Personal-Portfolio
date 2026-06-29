import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import ArticleForm from './components/ArticleForm';
import StatsDashboard from './components/StatsDashboard';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'read' | 'write' | 'dashboard'
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [serverStatus, setServerStatus] = useState({ fallbackMode: true });
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch articles and server status on launch
  useEffect(() => {
    fetchStatus();
    fetchArticles();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/articles/status');
      if (response.ok) {
        const data = await response.json();
        setServerStatus(data);
      }
    } catch (err) {
      console.warn("Could not query server status", err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setError('');
      } else {
        setError('Server responded with an error while fetching articles.');
      }
    } catch (err) {
      setError('Could not connect to the API server. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (payload, id) => {
    try {
      const url = id 
        ? `http://localhost:5000/api/articles/${id}` 
        : 'http://localhost:5000/api/articles';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchArticles();
        await fetchStatus();
        setArticleToEdit(null);
        setActiveView('feed');
        return true;
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to save the article.');
        return false;
      }
    } catch (err) {
      console.error("Error saving article:", err);
      alert('Network error. Failed to save.');
      return false;
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchArticles();
        await fetchStatus();
        // If current article view is the one deleted, switch back
        if (selectedArticleId === id) {
          setActiveView('feed');
        }
      } else {
        alert('Failed to delete the article.');
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const handleLikeArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}/like`, {
        method: 'POST'
      });
      if (response.ok) {
        const updated = await response.json();
        // Update state list
        setArticles(prev => prev.map(art => art._id === id ? updated : art));
        return updated;
      }
    } catch (err) {
      console.error("Error liking article:", err);
    }
    return null;
  };

  const handleStartEdit = (article) => {
    setArticleToEdit(article);
    setActiveView('write');
  };

  const handleReadArticle = (id) => {
    setSelectedArticleId(id);
    setActiveView('read');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Articles
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.tags && art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoriesList = ['All', 'Technology', 'Design', 'Philosophy', 'Science'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'write') setArticleToEdit(null);
        }} 
        serverStatus={serverStatus} 
      />

      <main style={{ flexGrow: 1, padding: '40px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* Error Callout Banner */}
        {error && (
          <div className="glass-container fade-in" style={{
            padding: '20px',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '10px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontWeight: '600' }}>{error}</span>
            <button onClick={fetchArticles} className="btn btn-secondary" style={{ marginLeft: '16px', padding: '6px 12px', fontSize: '0.8rem' }}>Retry</button>
          </div>
        )}

        {/* FEED VIEW */}
        {activeView === 'feed' && (
          <div className="fade-in">
            {/* Hero / Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '3rem',
                fontWeight: '800',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px'
              }}>
                Unleash Your Perspective
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                A premium space for ideas, design thoughts, research papers, and technology reviews. Crafted on the MERN stack.
              </p>
            </div>

            {/* Filters Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: '20px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ minWidth: '280px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search articles by title or tag..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--text-muted)" 
                  strokeWidth="2" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <div className="spinner" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="glass-container" style={{ padding: '60px 40px', textAlign: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>No Articles Match Your Search</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or category choice.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '30px'
              }}>
                {filteredArticles.map(art => (
                  <ArticleCard 
                    key={art._id} 
                    article={art} 
                    onReadMore={handleReadArticle} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* READ VIEW */}
        {activeView === 'read' && (
          <ArticleDetail 
            articleId={selectedArticleId} 
            onBack={() => setActiveView('feed')} 
            onLikeArticle={handleLikeArticle}
          />
        )}

        {/* WRITE VIEW */}
        {activeView === 'write' && (
          <ArticleForm 
            articleToEdit={articleToEdit} 
            onSave={handleSaveArticle} 
            onCancel={() => {
              setArticleToEdit(null);
              setActiveView('feed');
            }} 
          />
        )}

        {/* DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <StatsDashboard 
            articles={articles} 
            onEditArticle={handleStartEdit} 
            onDeleteArticle={handleDeleteArticle} 
          />
        )}

      </main>
    </div>
  );
}
