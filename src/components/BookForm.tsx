import React, { useState } from 'react';
import { BookStatus } from '../types';
import type { BookItem } from '../types';
import { Save, X, Plus } from 'lucide-react';

interface BookFormProps {
  book?: BookItem;
  onSave: (book: BookItem) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<BookItem>>({
    title: '',
    isbn: '',
    subject: '',
    authors: [{ name: '', description: '' }],
    publisher: '',
    language: 'English',
    pages: 0,
    barcode: '',
    price: 0,
    format: 'Paperback',
    status: BookStatus.AVAILABLE,
    isReferenceOnly: false,
    rack: { number: '', location: '' },
    coverImage: '',
    ...book
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleAuthorChange = (index: number, field: string, value: string) => {
    const newAuthors = [...(formData.authors || [])];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...(prev.authors || []), { name: '', description: '' }]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      barcode: formData.barcode || `B-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      dateOfPurchase: formData.dateOfPurchase || new Date(),
      publicationDate: formData.publicationDate || new Date(),
    } as BookItem);
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-content" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>{book ? 'Edit Book' : 'Add New Book'}</h3>
          <button className="btn btn-secondary" onClick={onCancel}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="grid" style={{ gap: '1.2rem' }}>
          <div className="flex" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '120px', height: '180px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="flex" style={{ height: '100%', justifyContent: 'center', color: '#ccc' }}>No Cover</div>
              )}
            </div>
            <div className="grid" style={{ gap: '0.8rem', flex: 1 }}>
              <div className="grid" style={{ gap: '0.4rem' }}>
                <label>Cover Image URL</label>
                <input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
              </div>
              <div className="grid" style={{ gap: '0.4rem' }}>
                <label>Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>ISBN</label>
              <input name="isbn" value={formData.isbn} onChange={handleChange} required />
            </div>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Subject</label>
              <input name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid" style={{ gap: '0.4rem' }}>
            <label className="flex" style={{ justifyContent: 'space-between' }}>
              Authors
              <button type="button" className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={addAuthor}>
                <Plus size={14} /> Add Author
              </button>
            </label>
            {formData.authors?.map((author, index) => (
              <div key={index} className="flex" style={{ gap: '0.5rem' }}>
                <input 
                  placeholder="Name" 
                  value={author.name} 
                  onChange={(e) => handleAuthorChange(index, 'name', e.target.value)} 
                  required 
                  style={{ flex: 1 }}
                />
                <input 
                  placeholder="Description" 
                  value={author.description} 
                  onChange={(e) => handleAuthorChange(index, 'description', e.target.value)} 
                  style={{ flex: 2 }}
                />
              </div>
            ))}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Rack Number</label>
              <input name="rack.number" value={formData.rack?.number} onChange={handleChange} required placeholder="e.g. R-101" />
            </div>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Rack Location</label>
              <input name="rack.location" value={formData.rack?.location} onChange={handleChange} required placeholder="e.g. Floor 1, Section A" />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Price</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Pages</label>
              <input type="number" name="pages" value={formData.pages} onChange={handleChange} required />
            </div>
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label>Format</label>
              <select name="format" value={formData.format} onChange={handleChange}>
                <option value="Hardcover">Hardcover</option>
                <option value="Paperback">Paperback</option>
                <option value="E-Book">E-Book</option>
                <option value="Audiobook">Audiobook</option>
              </select>
            </div>
          </div>

          <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
            <label className="flex">
              <input type="checkbox" name="isReferenceOnly" checked={formData.isReferenceOnly} onChange={handleChange} />
              Reference Only
            </label>
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={18} /> Save Book</button>
          </div>
        </form>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BookForm;
