import React, { useState, useEffect } from 'react';

export default function ArticleDetail({ articleId, onBack, onLikeArticle }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch article detail
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/articles/${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          console.error("Failed to load article detail");
        }
      } catch (err) {
        console.error("Error fetching article detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // Track scroll position for the progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async () => {
    setIsLiking(true);
    // Trigger parent callback to perform update
    const updated = await onLikeArticle(article._id);
    if (updated) {
      setArticle(prev => ({ ...prev, likes: updated.likes }));
    }
    setTimeout(() => setIsLiking(false), 800);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="glass-container" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
        <h2>Article Not Found</h2>
        <p style={{ margin: '16px 0', color: 'var(--text-secondary)' }}>The article you are looking for might have been deleted or moved.</p>
        <button onClick={onBack} className="btn btn-secondary">Go Back to Explore</button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 20px 80px 20px' }}>
      {/* Scroll Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Back button */}
      <button 
        onClick={onBack} 
        className="btn btn-secondary" 
        style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '0.88rem' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Explore
      </button>

      {/* Article Header */}
      <header style={{ marginBottom: '32px' }}>
        <span className="tag-pill" style={{ marginBottom: '16px', display: 'inline-block' }}>
          {article.category}
        </span>
        <h1 style={{
          fontSize: '2.5rem',
          lineHeight: '1.2',
          marginBottom: '16px',
          color: '#fff',
          fontFamily: 'var(--font-heading)'
        }}>
          {article.title}
        </h1>
        {article.subtitle && (
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            marginBottom: '24px',
            fontWeight: '400'
          }}>
            {article.subtitle}
          </p>
        )}

        {/* Read Metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: '1rem'
          }}>
            AP
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '600' }}>Aether Writer</span>
            <span>
              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {article.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      {article.coverImage && (
        <div style={{
          width: '100%',
          maxHeight: '450px',
          overflow: 'hidden',
          borderRadius: '16px',
          marginBottom: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <img 
            src={article.coverImage} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Article body content */}
      <article style={{
        fontSize: '1.1rem',
        lineHeight: '1.85',
        color: '#e2e8f0',
        whiteSpace: 'pre-wrap',
        marginBottom: '48px'
      }}>
        {article.content}
      </article>

      {/* Tags details block */}
      {article.tags && article.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
          {article.tags.map((tag, i) => (
            <span key={i} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-secondary)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactive clap element */}
      <div className="glass-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 30px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleLike}
            className={`btn ${isLiking ? 'bounce-active' : ''}`}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: isLiking ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: isLiking ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isLiking ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <svg 
              width="26" 
              height="26" 
              viewBox="0 0 24 24" 
              fill={isLiking ? 'var(--accent)' : 'none'} 
              stroke={isLiking ? 'var(--accent)' : 'currentColor'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
          </button>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Like this article</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{article.likes} Likes</span>
          </div>
        </div>

        <button onClick={onBack} className="btn btn-secondary">
          Explore more articles
        </button>
      </div>

      {/* Inline styles for bounce animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounceClap {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .bounce-active {
          animation: bounceClap 0.6s ease;
        }
      `}} />
    </div>
  );
}
