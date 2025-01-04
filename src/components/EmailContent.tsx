import React from 'react';

export const EmailContent: React.FC = () => {
  return (
    <div id="emailTemplate" style={{ display: 'none' }}>
      <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ backgroundColor: '#f4f4f4' }}>
        <tr>
          <td align="center" style={{ padding: '20px 0' }}>
            <table className="container" border="0" cellPadding="0" cellSpacing="0" width="600" style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {/* Header */}
              <tr>
                <td style={{ padding: '40px 40px 20px 40px' }}>
                  <h1 style={{ margin: 0, color: '#2C3E50', fontSize: '36px', fontWeight: 'bold' }}>$875,000</h1>
                  <p style={{ margin: '10px 0 0 0', color: '#7F8C8D', fontSize: '16px' }}>123 Investment Avenue, Beverly Hills, CA 90210</p>
                </td>
              </tr>
              {/* Rest of the email content */}
              {/* ... Same content as email-template.html but with React-compatible attributes ... */}
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
};