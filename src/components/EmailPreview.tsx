import React from 'react';
import { emailTemplate } from '../templates/investmentEmail';

export const EmailPreview: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Investment Property Email Template</h2>
        <button 
          onClick={() => {
            const el = document.createElement('textarea');
            el.value = emailTemplate;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('Template copied to clipboard!');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Copy HTML
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <iframe
          srcDoc={emailTemplate}
          className="w-full h-[800px] border-0"
          title="Email Template Preview"
        />
      </div>
    </div>
  );
};