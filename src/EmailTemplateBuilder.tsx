                    import React, { useState } from 'react';
import './EmailTemplateBuilder.css';
import { githubService } from './services/github';

interface Item {
    id: string;
    name: string;
    type: 'feature' | 'repair';
    checked: boolean;
    year?: string;
    details?: string;
    category: string;
}

interface GalleryImage {
    file?: File;
    url: string;
    alt: string;
}

const EmailTemplateBuilder = () => {
    // Email Content States
    const [subject, setSubject] = useState('Off-Market Investment Property');
    const [preheader, setPreheader] = useState('Exclusive investment opportunity with high ROI potential');
    const [customMessage, setCustomMessage] = useState('Welcome to this exceptional investment opportunity. This property offers a perfect blend of current income potential and future appreciation. With its prime location and strong market fundamentals, it represents an ideal addition to your investment portfolio.');
    const [footerMessage, setFooterMessage] = useState('This is an exclusive off-market investment opportunity.\nContact us for more information.');
    const [logoUrl] = useState('https://staged.page/dealdispo/Dispo-Logo-Do-Not-Move-Delete.png');

    // Property Info States
    const [address, setAddress] = useState('123 Investment Avenue, Beverly Hills, CA 90210');
    const [squareFootage, setSquareFootage] = useState('3,200 sq ft');
    const [bedroomsBaths, setBedroomsBaths] = useState('4 bed / 3 bath');
    const [lotSize, setLotSize] = useState('0.25 acres');
    const [yearBuilt, setYearBuilt] = useState('1985');
    const [marketValue, setMarketValue] = useState('$875,000');
    const [arv, setArv] = useState('$1,200,000');

    // Media States
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImageUrl, setMainImageUrl] = useState('https://images.unsplash.com/photo-1564013799919-ab600027ffc6');
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
        { url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc', alt: 'Kitchen' },
        { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', alt: 'Living Room' },
        { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8', alt: 'Backyard' }
    ]);

    // Investment Details States
    const [showInvestmentDetails, setShowInvestmentDetails] = useState(true);
    const [repairCosts, setRepairCosts] = useState('$150,000');
    const [profitMargin, setProfitMargin] = useState('$175,000');
    const [comparableProperties, setComparableProperties] = useState('$1.1M - $1.3M');
    const [marketTrends, setMarketTrends] = useState('8% annual appreciation');
    const [phoneNumber] = useState('904-335-8553');

    // Features & Repairs States
    const [items, setItems] = useState<Item[]>([
        { id: '1', name: 'Roof', type: 'repair', checked: false, category: 'Exterior', year: '', details: '' },
        { id: '2', name: 'HVAC', type: 'feature', checked: false, category: 'Systems', year: '', details: '' },
        { id: '3', name: 'Windows', type: 'repair', checked: false, category: 'Exterior', year: '', details: '' },
        { id: '4', name: 'Kitchen', type: 'feature', checked: false, category: 'Interior', year: '', details: '' },
        { id: '5', name: 'Bathrooms', type: 'repair', checked: false, category: 'Interior', year: '', details: '' },
        { id: '6', name: 'Electrical', type: 'repair', checked: false, category: 'Systems', year: '', details: '' },
        { id: '7', name: 'Plumbing', type: 'repair', checked: false, category: 'Systems', year: '', details: '' },
        { id: '8', name: 'Large backyard', type: 'feature', checked: false, category: 'Exterior', year: '', details: '' }
    ]);

    const handleItemChange = (id: string, field: keyof Item, value: string | boolean) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setMainImageFile(file);
                const imageUrl = await githubService.uploadImage(file);
                setMainImageUrl(imageUrl);
            } catch (error) {
                console.error('Error uploading main image:', error);
                alert('Failed to upload image. Please try again.');
            }
        }
    };

    const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const newImages = [...galleryImages];
                const imageUrl = await githubService.uploadImage(file);
                newImages[index] = {
                    ...newImages[index],
                    file: file,
                    url: imageUrl
                };
                setGalleryImages(newImages);
            } catch (error) {
                console.error('Error uploading gallery image:', error);
                alert('Failed to upload image. Please try again.');
            }
        }
    };

    const generateEmailTemplate = () => {
        return `<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style type="text/css">
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .property-details td {
        display: block !important;
        width: 100% !important;
      }
      .gallery img {
        width: 100% !important;
        height: auto !important;
      }
    }
    @media print {
      body {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .container {
        width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 20px 0; text-align: center; border-bottom: 1px solid #eee;">
              <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; height: auto;" />
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; color: #2C3E50; font-size: 36px; font-weight: bold;">${marketValue}</h1>
              <p style="margin: 10px 0 0 0; color: #7F8C8D; font-size: 16px;">${address}</p>
            </td>
          </tr>

          <!-- Main Property Image -->
          <tr>
            <td style="padding: 0 40px;">
              <img src="${mainImageUrl}" alt="Property Front View" style="width: 100%; height: auto;" />
            </td>
          </tr>
          
          <!-- Custom Message -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="margin: 0; color: #2C3E50; font-size: 16px; line-height: 1.6;">
                ${customMessage}
              </p>
            </td>
          </tr>

          <!-- Property Details Grid -->
          <tr>
            <td style="padding: 30px 40px;">
              <table class="property-details" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; border-spacing: 10px;">
                <tr>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Square Footage</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${squareFootage}</p>
                  </td>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Bedrooms/Baths</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${bedroomsBaths}</p>
                  </td>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Lot Size</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${lotSize}</p>
                  </td>
                </tr>
                <tr>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Year Built</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${yearBuilt}</p>
                  </td>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">Market Value</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${marketValue}</p>
                  </td>
                  <td width="33%" style="background-color: #F8F9FA; padding: 15px; border-radius: 4px; text-align: center;">
                    <p style="margin: 0; color: #7F8C8D; font-size: 14px;">ARV</p>
                    <p style="margin: 5px 0 0 0; color: #2C3E50; font-size: 18px; font-weight: bold;">${arv}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Required Repairs & Features -->
          <tr>
            <td style="padding: 0 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${(() => {
                  const hasRepairs = items.filter(item => item.type === 'repair' && item.checked).length > 0;
                  const hasFeatures = items.filter(item => item.type === 'feature' && item.checked).length > 0;
                  
                  if (hasRepairs || hasFeatures) {
                    return `
                    <tr>
                      <td style="padding: 0 40px; vertical-align: top;">
                        ${hasRepairs ? `
                        <div>
                          <h2 style="color: #2C3E50; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Required Repairs</h2>
                          <ul style="margin: 0; padding: 0 0 0 20px; color: #2C3E50;">
                            ${items.filter(item => item.type === 'repair' && item.checked)
                              .map(item => `<li style="margin-bottom: 12px;">
                                <strong>${item.name}</strong>
                                ${item.year ? ` (${item.year})` : ''}
                                ${item.details ? `<br><span style="font-size: 15px; color: #2C3E50; margin-top: 4px; display: block;">${item.details}</span>` : ''}
                              </li>`)
                              .join('')}
                          </ul>
                        </div>
                        ` : ''}
                        ${hasFeatures ? `
                        <div>
                          <h2 style="color: #2C3E50; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Positive Features</h2>
                          <ul style="margin: 0; padding: 0 0 0 20px; color: #2C3E50;">
                            ${items.filter(item => item.type === 'feature' && item.checked)
                              .map(item => `<li style="margin-bottom: 12px;">
                                <strong>${item.name}</strong>
                                ${item.year ? ` (${item.year})` : ''}
                                ${item.details ? `<br><span style="font-size: 15px; color: #2C3E50; margin-top: 4px; display: block;">${item.details}</span>` : ''}
                              </li>`)
                              .join('')}
                          </ul>
                        </div>
                        ` : ''}
                      </td>
                    </tr>`;
                  }
                  return '';
                })()}
              </table>
            </td>
          </tr>

          <!-- Image Gallery -->
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <table class="gallery" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${galleryImages.map(image => `
                <tr>
                  <td style="padding: 5px;">
                    <img src="${image.url}" />
                  </td>
                </tr>`).join('')}
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 30px 40px 40px 40px; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #2ECC71; border-radius: 4px; padding: 15px 30px;">
                    <a href="tel:+19043358553" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold;">Make An Offer</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #F8F9FA; text-align: center;">
              <p style="margin: 0; color: #7F8C8D; font-size: 14px;">
                ${footerMessage.split('\n').join('<br />')}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  [[trackingImage]]
</body>
</html>`;
    };

    const formatCurrency = (value: string): string => {
        // Remove any non-digit characters
        const numericValue = value.replace(/\D/g, '');
        
        // Convert to number and format with commas and dollar sign
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(parseInt(numericValue) || 0);

        return formattedValue;
    };

    const handleMarketValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formattedValue = formatCurrency(rawValue);
        setMarketValue(formattedValue);
    };

    const handleSubmit = () => {
        const emailTemplate = generateEmailTemplate();
        
        // Create a temporary textarea element to copy the HTML
        const el = document.createElement('textarea');
        el.value = emailTemplate;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        alert('HTML template copied to clipboard! You can now paste it into Constant Contact.');
    };

    return (
        <div className="email-template-builder">
            <div className="form-container">
                <div className="form-inner" style={{ overflowY: 'scroll' }}>
                    <div className="form-section">
                        <h2>Property Value & Location</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Market Value</label>
                                <input
                                    type="text"
                                    value={marketValue}
                                    onChange={handleMarketValueChange}
                                    placeholder="Current market value"
                                    className="input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Property Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter property address"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Main Property Image</label>
                            <div className="image-upload-container">
                                {mainImageUrl && (
                                    <div className="image-preview">
                                        <img src={mainImageUrl} alt="Main property" />
                                    </div>
                                )}
                                <div className="upload-controls">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageUpload}
                                        className="file-input"
                                        id="main-image-upload"
                                    />
                                    <label htmlFor="main-image-upload" className="upload-button">
                                        Choose Image
                                    </label>
                                    {mainImageFile && (
                                        <span className="file-name">{mainImageFile.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Email Content</h2>
                        <div className="form-group">
                            <label>Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject"
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Preheader Text</label>
                            <input
                                type="text"
                                value={preheader}
                                onChange={(e) => setPreheader(e.target.value)}
                                placeholder="Enter email preheader"
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Custom Message</label>
                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Enter your custom message for the email"
                                className="textarea"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Property Details</h2>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">Property Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Address:</span>
                                        <span className="font-medium text-white">{address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Square Footage:</span>
                                        <span className="font-medium text-white">{squareFootage}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Bedrooms/Baths:</span>
                                        <span className="font-medium text-white">{bedroomsBaths}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Lot Size:</span>
                                        <span className="font-medium text-white">{lotSize}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Year Built:</span>
                                        <span className="font-medium text-white">{yearBuilt}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">Investment Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Market Value:</span>
                                        <span className="font-medium text-white">{marketValue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">ARV:</span>
                                        <span className="font-medium text-white">{arv}</span>
                                    </div>
                                    {showInvestmentDetails && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Repair Costs:</span>
                                                <span className="font-medium text-white">{repairCosts}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Profit Margin:</span>
                                                <span className="font-medium text-green-400">{profitMargin}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section features-repairs">
                        <h2>Features & Repairs</h2>
                        {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <div key={category} className="category-section">
                                <h3>{category}</h3>
                                {categoryItems.map((item) => (
                                    <div key={item.id} className="item-row">
                                        <div className="item-header">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={(e) => handleItemChange(item.id, 'checked', e.target.checked)}
                                                    className="toggle-input"
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                        {item.checked && (
                                            <div className="item-details">
                                                <div className="type-selector">
                                                    <button
                                                        className={`type-button ${item.type === 'feature' ? 'active' : ''}`}
                                                        onClick={() => handleItemChange(item.id, 'type', 'feature')}
                                                    >
                                                        Feature
                                                    </button>
                                                    <button
                                                        className={`type-button ${item.type === 'repair' ? 'active' : ''}`}
                                                        onClick={() => handleItemChange(item.id, 'type', 'repair')}
                                                    >
                                                        Repair
                                                    </button>
                                                </div>
                                                <div className="details-grid">
                                                    <input
                                                        type="text"
                                                        value={item.year || ''}
                                                        onChange={(e) => handleItemChange(item.id, 'year', e.target.value)}
                                                        placeholder="Year"
                                                        className="input year-input"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.details || ''}
                                                        onChange={(e) => handleItemChange(item.id, 'details', e.target.value)}
                                                        placeholder="Details"
                                                        className="input details-input"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="form-section investment-details">
                        <div className="section-header">
                            <h2>Investment Details</h2>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={showInvestmentDetails}
                                    onChange={(e) => setShowInvestmentDetails(e.target.checked)}
                                    className="toggle-input"
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        {showInvestmentDetails && (
                            <div className="investment-fields">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Repair Costs</label>
                                        <input
                                            type="text"
                                            value={repairCosts}
                                            onChange={(e) => setRepairCosts(e.target.value)}
                                            placeholder="Estimated repair costs"
                                            className="input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Profit Margin</label>
                                        <input
                                            type="text"
                                            value={profitMargin}
                                            onChange={(e) => setProfitMargin(e.target.value)}
                                            placeholder="Potential profit margin"
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Comparable Properties</label>
                                        <input
                                            type="text"
                                            value={comparableProperties}
                                            onChange={(e) => setComparableProperties(e.target.value)}
                                            placeholder="Comparable property values"
                                            className="input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Market Trends</label>
                                        <input
                                            type="text"
                                            value={marketTrends}
                                            onChange={(e) => setMarketTrends(e.target.value)}
                                            placeholder="Current market trends"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Contact Information</h2>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Footer Content</h2>
                        <div className="form-group">
                            <label>Footer Message</label>
                            <textarea
                                value={footerMessage}
                                onChange={(e) => setFooterMessage(e.target.value)}
                                placeholder="Enter footer message"
                                className="textarea"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Gallery Images</h2>
                        {galleryImages.map((image, index) => (
                            <div key={index} className="form-group gallery-image">
                                <div className="image-upload-container">
                                    {image.url && (
                                        <div className="image-preview">
                                            <img src={image.url} alt={image.alt} />
                                        </div>
                                    )}
                                    <div className="upload-controls">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleGalleryImageUpload(e, index)}
                                            className="file-input"
                                            id={`gallery-image-${index}`}
                                        />
                                        <label htmlFor={`gallery-image-${index}`} className="upload-button">
                                            Choose Image
                                        </label>
                                        {image.file && (
                                            <span className="file-name">{image.file.name}</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={image.alt}
                                        onChange={(e) => {
                                            const newImages = [...galleryImages];
                                            newImages[index].alt = e.target.value;
                                            setGalleryImages(newImages);
                                        }}
                                        placeholder="Image description"
                                        className="input"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setGalleryImages([...galleryImages, { url: '', alt: '' }])}
                            className="button"
                        >
                            Add Gallery Image
                        </button>
                    </div>

                    <div className="form-section">
                        <button onClick={handleSubmit} className="submit-button">
                            Generate Template
                        </button>
                    </div>
                </div>
            </div>

            <div className="preview-container">
                <div className="preview-inner">
                    <div dangerouslySetInnerHTML={{ __html: generateEmailTemplate() }} />
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateBuilder;
