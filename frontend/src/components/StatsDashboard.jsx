import React from 'react';

export default function StatsDashboard({ articles, onEditArticle, onDeleteArticle }) {
  // Aggregate stats
  const totalArticles = articles.length;
  const totalLikes = articles.reduce((sum, art) => sum + (art.likes || 0), 0);
  const totalReadingTime = articles.reduce((sum, art) => sum + (art.readingTime || 0), 0);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteArticle(id);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '8px' }}>
          Platform Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your published content and review metrics overview.
        </p>
      </header>

      {/* Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Metric 1 */}
        <div className="glass-container" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--primary)',
            filter: 'blur(40px)',
            opacity: 0.2
          }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Published Posts
          </span>
          <h2 style={{ fontSize: '3rem', margin: '8px 0 0 0', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {totalArticles}
          </h2>
        </div>

        {/* Metric 2 */}
        <div className="glass-container" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--accent)',
            filter: 'blur(40px)',
            opacity: 0.2
          }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Appreciations
          </span>
          <h2 style={{ fontSize: '3rem', margin: '8px 0 0 0', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {totalLikes}
          </h2>
        </div>

        {/* Metric 3 */}
        <div className="glass-container" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--secondary)',
            filter: 'blur(40px)',
            opacity: 0.2
          }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Read Time
          </span>
          <h2 style={{ fontSize: '3rem', margin: '8px 0 0 0', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {totalReadingTime} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>mins</span>
          </h2>
        </div>
      </div>

      {/* Content Management Table */}
      <div className="glass-container" style={{ padding: '24px', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '20px' }}>
          Manage Articles
        </h2>

        {totalArticles === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No articles found. Go to the "Write" section to publish your first post!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Article</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Likes</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={art.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=80&q=80'} 
                      alt="" 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {art.title}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {art.readingTime} min read
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="tag-pill" style={{ fontSize: '0.7rem' }}>{art.category}</span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#fff' }}>{art.likes || 0}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(art.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => onEditArticle(art)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(art._id, art.title)}
                        className="btn btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}} />
    </div>
  );
}
