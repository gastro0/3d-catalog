import React, { useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelCategory, setModelCategory] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Архитектура",
    "Для дома",
    "Декор",
    "Игрушки",
    "Животные",
    "Игры"
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal animated-modal" onClick={e => e.stopPropagation()}>
        <h2 style={{marginBottom:'1rem', color: '#111'}}>Загрузка 3D модели</h2>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',marginBottom:6,fontWeight:500,color:'#111'}}>Название модели<span style={{color:'#e94e77'}}>*</span></label>
          <input
            type="text"
            value={modelName}
            onChange={e => setModelName(e.target.value)}
            placeholder="Введите название модели"
            style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginBottom:10}}
            required
          />
          <label style={{display:'block',marginBottom:6,fontWeight:500,color:'#111'}}>Описание</label>
          <textarea
            value={modelDescription}
            onChange={e => setModelDescription(e.target.value)}
            placeholder="Краткое описание модели"
            style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginBottom:10,minHeight:50}}
          />
          <label style={{display:'block',marginBottom:6,fontWeight:500,color:'#111'}}>Категория<span style={{color:'#e94e77'}}>*</span></label>
          <select
            value={modelCategory}
            onChange={e => setModelCategory(e.target.value)}
            style={{width:'100%',padding:'8px',borderRadius:6,border:'1px solid #ccc',marginBottom:10}}
            required
          >
            <option value="" style={{color:'#111'}}>Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat} value={cat} style={{color:'#111'}}>{cat}</option>
            ))}
          </select>
        </div>
        <div
          className={`dropzone${dragActive ? ' active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div style={{marginBottom:'1rem', color: '#111'}}>
              <strong style={{color: '#111'}}>Выбран файл:</strong> {selectedFile.name}
            </div>
          ) : (
            <>
              <p style={{color: '#111'}}>Перетащите файл сюда</p>
              <p style={{color: '#111'}}>или</p>
              <button type="button" className="browse-btn" onClick={handleBrowseClick}>Обзор</button>
              <input
                type="file"
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".obj,.fbx,.gltf,.glb,.stl,.zip"
              />
            </>
          )}
        </div>
        <button
          type="button"
          className="browse-btn"
          style={{ margin: '1.5rem auto 0 auto', display: 'block', width: '70%', maxWidth: 220 }}
          disabled={!(selectedFile && modelName && modelCategory)}
          onClick={async () => {
            if (!(selectedFile && modelName && modelCategory)) return;
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;
            if (!token) {
              alert('Вы не авторизованы!');
              return;
            }
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', modelName);
            formData.append('description', modelDescription);
            formData.append('category', modelCategory);
            try {
              const response = await fetch('http://localhost:3000/files', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
              if (response.ok) {
                alert('Файл успешно загружен!');
                setSelectedFile(null);
                setModelName("");
                setModelDescription("");
                setModelCategory("");
                onClose();
              } else {
                const errorText = await response.text();
                alert('Ошибка загрузки файла: ' + errorText);
              }
            } catch (err) {
              alert('Ошибка загрузки файла: ' + (err?.message || err));
            }
          }}
        >Загрузить</button>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          style={{ margin: '0.5rem auto 0 auto', display: 'block', width: '70%', maxWidth: 220 }}
        >Закрыть</button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          min-width: 340px;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          position: relative;
        }
        .dropzone {
          border: 2px dashed #aaa;
          border-radius: 12px;
          padding: 2rem 1rem;
          text-align: center;
          background: #f8f8f8;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .dropzone.active {
          border-color: #1976d2;
          background: #e3f2fd;
        }
        .browse-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .close-btn {
          background: #e57373;
          color: #fff;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
