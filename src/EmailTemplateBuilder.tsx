                    import React, { useState } from 'react';
import './EmailTemplateBuilder.css';

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
    const [items, setItems] = useState([
        { id: '1', name: 'Roof', type: 'repair', checked: false, category: 'Exterior' },
        { id: '2', name: 'HVAC', type: 'feature', checked: false, category: 'Systems' },
        { id: '3', name: 'Windows', type: 'repair', checked: false, category: 'Exterior' },
        { id: '4', name: 'Kitchen', type: 'feature', checked: false, category: 'Interior' },
        { id: '5', name: 'Bathrooms', type: 'repair', checked: false, category: 'Interior' },
        { id: '6', name: 'Electrical', type: 'repair', checked: false, category: 'Systems' },
        { id: '7', name: 'Plumbing', type: 'repair', checked: false, category: 'Systems' },
        { id: '8', name: 'Large backyard', type: 'feature', checked: false, category: 'Exterior' }
    ]);

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMainImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setMainImageUrl(imageUrl);
        }
    };

    const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const newImages = [...galleryImages];
            newImages[index] = {
                ...newImages[index],
                file: file,
                url: URL.createObjectURL(file)
            };
            setGalleryImages(newImages);
        }
    };

    const generateEmailTemplate = () => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Off-Market Investment Property</title>
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
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">[[trackingImage]]
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; color: #2C3E50; font-size: 36px; font-weight: bold;">${marketValue}</h1>
              <p style="margin: 10px 0 0 0; color: #7F8C8D; font-size: 16px;">${address}</p>
            </td>
          </tr>

          <!-- Main Property Image -->
          <tr>
            <td style="padding: 0 40px;">
              <img src="${mainImageUrl}" alt="Property Front View" style="width: 100%; height: auto; border-radius: 4px;" />
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
                <tr>
                  <td width="50%" style="padding-right: 10px; vertical-align: top;">
                    <h3 style="color: #2C3E50; margin: 0 0 15px 0;">Required Repairs</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #7F8C8D;">
                      ${items.filter(item => item.type === 'repair' && item.checked)
                        .map(item => `<li style="margin-bottom: 8px;">${item.name}</li>`)
                        .join('')}
                    </ul>
                  </td>
                  <td width="50%" style="padding-left: 10px; vertical-align: top;">
                    <h3 style="color: #2C3E50; margin: 0 0 15px 0;">Positive Features</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #7F8C8D;">
                      ${items.filter(item => item.type === 'feature' && item.checked)
                        .map(item => `<li style="margin-bottom: 8px;">${item.name}</li>`)
                        .join('')}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Investment Potential -->
          <tr>
            <td style="padding: 30px 40px;">
              <h3 style="color: #2C3E50; margin: 0 0 15px 0;">Investment Potential</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F9FA; border-radius: 4px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #2C3E50;"><strong>Estimated Repair Costs:</strong> ${repairCosts}</p>
                    <p style="margin: 0 0 10px 0; color: #2C3E50;"><strong>Potential Profit Margin:</strong> ${profitMargin}</p>
                    <p style="margin: 0 0 10px 0; color: #2C3E50;"><strong>Comparable Properties:</strong> ${comparableProperties}</p>
                    <p style="margin: 0; color: #2C3E50;"><strong>Market Trends:</strong> ${marketTrends}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Image Gallery -->
          <tr>
            <td style="padding: 0 40px;">
              <table class="gallery" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${galleryImages.map(image => `
                <tr>
                  <td style="padding: 5px;">
                    <img src="${image.url}" alt="${image.alt}" style="width: 100%; height: auto; border-radius: 4px;" />
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
                    <a href="#" style="color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold;">Schedule Viewing</a>
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
</body>
</html>`;

    const handleSubmit = async () => {
        const emailTemplate = generateEmailTemplate();
        const payload = {
            subject: subject,
            preheader: preheader,
            htmlContent: emailTemplate
        };

        try {
            const response = await fetch('https://hook.us2.make.com/i77q65mtf72ipg5w7p8wfma1bn64waak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Template submitted successfully!');
            } else {
                throw new Error('Failed to submit template');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit template. Please try again.');
        }
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
                                    onChange={(e) => setMarketValue(e.target.value)}
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
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Square Footage</label>
                                <input
                                    type="text"
                                    value={squareFootage}
                                    onChange={(e) => setSquareFootage(e.target.value)}
                                    placeholder="Square footage"
                                    className="input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bedrooms/Baths</label>
                                <input
                                    type="text"
                                    value={bedroomsBaths}
                                    onChange={(e) => setBedroomsBaths(e.target.value)}
                                    placeholder="e.g., 3 bed / 2 bath"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Lot Size</label>
                                <input
                                    type="text"
                                    value={lotSize}
                                    onChange={(e) => setLotSize(e.target.value)}
                                    placeholder="e.g., 0.25 acres"
                                    className="input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Year Built</label>
                                <input
                                    type="text"
                                    value={yearBuilt}
                                    onChange={(e) => setYearBuilt(e.target.value)}
                                    placeholder="Year built"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>ARV (After Repair Value)</label>
                            <input
                                type="text"
                                value={arv}
                                onChange={(e) => setArv(e.target.value)}
                                placeholder="After Repair Value"
                                className="input"
                            />
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
                                                    onChange={(e) => {
                                                        const updatedItems = items.map((i) =>
                                                            i.id === item.id ? { ...i, checked: e.target.checked } : i
                                                        );
                                                        setItems(updatedItems);
                                                    }}
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
                                                        onClick={() => {
                                                            const updatedItems = items.map((i) =>
                                                                i.id === item.id ? { ...i, type: 'feature' } : i
                                                            );
                                                            setItems(updatedItems);
                                                        }}
                                                    >
                                                        Feature
                                                    </button>
                                                    <button
                                                        className={`type-button ${item.type === 'repair' ? 'active' : ''}`}
                                                        onClick={() => {
                                                            const updatedItems = items.map((i) =>
                                                                i.id === item.id ? { ...i, type: 'repair' } : i
                                                            );
                                                            setItems(updatedItems);
                                                        }}
                                                    >
                                                        Repair
                                                    </button>
                                                </div>
                                                <div className="details-grid">
                                                    <input
                                                        type="text"
                                                        value={item.year || ''}
                                                        onChange={(e) => {
                                                            const updatedItems = items.map((i) =>
                                                                i.id === item.id ? { ...i, year: e.target.value } : i
                                                            );
                                                            setItems(updatedItems);
                                                        }}
                                                        placeholder="Year"
                                                        className="input year-input"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.details || ''}
                                                        onChange={(e) => {
                                                            const updatedItems = items.map((i) =>
                                                                i.id === item.id ? { ...i, details: e.target.value } : i
                                                            );
                                                            setItems(updatedItems);
                                                        }}
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
                <div className="preview-inner" style={{ height: '100%', overflowY: 'auto' }}>
                    <div dangerouslySetInnerHTML={{ __html: generateEmailTemplate() }} />
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateBuilder;
