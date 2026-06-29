import React, { useState, useEffect } from 'react';

export default function ArticleForm({ articleToEdit, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load article values if editing
  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || '');
      setSubtitle(articleToEdit.subtitle || '');
      setContent(articleToEdit.content || '');
      setCategory(articleToEdit.category || 'Technology');
      setCoverImage(articleToEdit.coverImage || '');
      setTags(articleToEdit.tags ? articleToEdit.tags.join(', ') : '');
    } else {
      // Clear form
      setTitle('');
      setSubtitle('');
      setContent('');
      setCategory('Technology');
      setCoverImage('');
      setTags('');
    }
  }, [articleToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }
    setError('');
    setSubmitting(true);

    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title,
      subtitle,
      content,
      category,
      tags: parsedTags,
      coverImage: coverImage.trim() || undefined
    };

    const success = await onSave(payload, articleToEdit?._id);
    setSubmitting(false);
    
    if (success && !articleToEdit) {
      // Clear form on new create success
      setTitle('');
      setSubtitle('');
      setContent('');
      setTags('');
      setCoverImage('');
    }
  };

  const imagePreview = coverImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '8px' }}>
          {articleToEdit ? 'Edit Article' : 'Draft New Article'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {articleToEdit ? 'Modify your content and preview changes live.' : 'Share your ideas with the community. Realtime mockup renders on the right.'}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column - Form Fields */}
        <form onSubmit={handleSubmit} className="glass-container" style={{ padding: '30px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Title *</label>
            <input 
              type="text" 
              placeholder="e.g. The Future of Edge Computing" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtitle</label>
            <input 
              type="text" 
              placeholder="A brief summary or hook statement" 
              value={subtitle} 
              onChange={e => setSubtitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Science">Science</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, css, dev" 
                value={tags} 
                onChange={e => setTags(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Image URL</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/... or leave blank" 
              value={coverImage} 
              onChange={e => setCoverImage(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Body Content *</label>
            <textarea 
              placeholder="Write your article markdown/text content here..." 
              value={content} 
              onChange={e => setContent(e.target.value)}
              required
              rows={8}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving...' : (articleToEdit ? 'Update Article' : 'Publish Article')}
            </button>
          </div>
        </form>

        {/* Right Column - Live Preview */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Feed Card Preview
          </h2>
          <div className="glass-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '400px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(10, 10, 15, 0.8)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: 'var(--secondary)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                textTransform: 'uppercase'
              }}>
                {category}
              </span>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Just now
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.3' }}>
                  {title || 'Untitled Post'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {subtitle || 'A subtitle preview will show here...'}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min read
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  0 likes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
