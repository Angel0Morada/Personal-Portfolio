import React from 'react';

export default function ArticleCard({ article, onReadMore }) {
  const { title, subtitle, coverImage, category, readingTime, likes, createdAt } = article;
  
  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Safe fallback cover image
  const imageSrc = coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      onClick={() => onReadMore(article._id)}
      className="glass-container hover-float" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '420px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, box-shadow 0.3s',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-glow)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.15)';
        const img = e.currentTarget.querySelector('.card-image');
        if (img) img.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
        const img = e.currentTarget.querySelector('.card-image');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      {/* Article Image Panel */}
      <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
        <img 
          className="card-image"
          src={imageSrc} 
          alt={title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
        {/* Category Label overlay */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(10, 10, 15, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '700',
          color: 'var(--secondary)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {category}
        </span>
      </div>

      {/* Card Info Content */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            {formatDate(createdAt)}
          </span>
          <h3 style={{
            fontSize: '1.25rem',
            color: 'var(--text-primary)',
            marginBottom: '10px',
            lineHeight: '1.35',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: 'var(--font-heading)'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {subtitle || 'Click to read this article\'s details.'}
          </p>
        </div>

        {/* Footer Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '12px',
          marginTop: '12px'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {readingTime} min read
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            {likes} likes
          </span>
        </div>
      </div>
    </div>
  );
}
