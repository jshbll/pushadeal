import React from 'react';

export const EmailTemplate: React.FC = () => {
  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <iframe
        srcDoc={`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Off-Market Investment Property</title>
          <style type="text/css">
            @media screen and (max-width: 600px) {
              .container { width: 100% !important; }
              .property-details td { display: block !important; width: 100% !important; }
              .gallery img { width: 100% !important; height: auto !important; }
            }
            @media print {
              body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
              .container { width: 100% !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          ${document.getElementById('emailTemplate')?.innerHTML || ''}
        </body>
        </html>`}
        className="w-full h-[800px] border-0"
        title="Email Template Preview"
      />
    </div>
  );
};