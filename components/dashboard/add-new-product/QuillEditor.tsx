'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder,
  minHeight = '150px',
}: QuillEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className='w-full bg-white relative' style={{ minHeight }}>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className='w-full h-full'
      />
      <style>{`
        .quill {
          display: flex;
          flex-direction: column;
          height: ${minHeight};
        }
        .ql-container {
          flex: 1;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
