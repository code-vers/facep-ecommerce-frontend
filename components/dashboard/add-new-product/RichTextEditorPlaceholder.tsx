'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  MoreHorizontal,
  Smile,
  Type
} from 'lucide-react';

interface RichTextEditorPlaceholderProps {
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditorPlaceholder({ 
  placeholder = "Write something...",
  minHeight = "200px"
}: RichTextEditorPlaceholderProps) {
  return (
    <div className="w-full border border-[#E5E5E6] rounded-[4px] bg-white overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#E5E5E6] bg-[#F9FAFB]">
        {/* Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E5E5E6]">
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Type size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Bold size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Italic size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Underline size={16} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 px-2 border-r border-[#E5E5E6]">
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <AlignLeft size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <AlignCenter size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <AlignRight size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <AlignJustify size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-2 border-r border-[#E5E5E6]">
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <List size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <ListOrdered size={16} />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 px-2">
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Link size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <ImageIcon size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <Smile size={16} />
          </button>
          <button type="button" className="p-1.5 hover:bg-[#E5E5E6] rounded text-[#42454D] transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <textarea
        className="w-full p-4 resize-y outline-none text-[14px] text-black placeholder:text-[#848995] font-normal leading-normal"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
}
