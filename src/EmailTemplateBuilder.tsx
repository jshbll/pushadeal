import React, { useState, useEffect } from 'react';
import { Camera, Upload, Plus, X } from 'lucide-react';

const EmailTemplateBuilder = () => {
  // State definitions
  const [activeSection, setActiveSection] = useState('details');
  const [formData, setFormData] = useState({
    askingPrice: '',
    address: '',
    message: '',
    squareFootage: '',
    bedrooms: '',
    bathrooms: '',
    lotSize: '',
    yearBuilt: '',
    arv: '',
  });

  // Occupancy Status
  const [occupancyStatus, setOccupancyStatus] = useState('');
  const [vacantDate, setVacantDate] = useState('');
  const [vacantOnClosing, setVacantOnClosing] = useState(false);

  // Media States
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);

  // Features State
  const [features, setFeatures] = useState([
    { id: '1', name: 'HVAC', status: 'unset', year: '' },
    { id: '2', name: 'Roof', status: 'unset', year: '' },
    { id: '3', name: 'Windows', status: 'unset', year: '' },
    { id: '4', name: 'Kitchen', status: 'unset', year: '' }
  ]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'main') {
        setMainImage(reader.result);
      } else {
        setGalleryImages(prev => [...prev, reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      <div className="email-template-builder">
        {/* Form Section */}
        <div className="form-container">
          {/* Navigation */}
          <div className="type-selector">
            <button
              className={`type-button ${activeSection === 'details' ? 'active' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              Details
            </button>
            <button
              className={`type-button ${activeSection === 'features' ? 'active' : ''}`}
              onClick={() => setActiveSection('features')}
            >
              Features
            </button>
            <button
              className={`type-button ${activeSection === 'media' ? 'active' : ''}`}
              onClick={() => setActiveSection('media')}
            >
              Media
            </button>
          </div>

          {activeSection === 'details' && (
            <div className="form-section">
              <h2>Property Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Asking Price</label>
                  <input
                    type="text"
                    name="askingPrice"
                    value={formData.askingPrice}
                    onChange={handleInputChange}
                    placeholder="Enter asking price"
                  />
                </div>
                <div className="form-group">
                  <label>Property Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter property address"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bathrooms"
                  />
                </div>
                <div className="form-group">
                  <label>Square Footage</label>
                  <input
                    type="text"
                    name="squareFootage"
                    value={formData.squareFootage}
                    onChange={handleInputChange}
                    placeholder="Enter square footage"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="form-section">
              <h2>Property Features</h2>
              <div className="features-wrapper">
                {features.map(feature => (
                  <div key={feature.id} className="feature-item">
                    <div className="feature-row">
                      <span className="feature-label">{feature.name}</span>
                      <div className="radio-group">
                        <button
                          onClick={() => {
                            setFeatures(features.map(f =>
                              f.id === feature.id ? { ...f, status: 'good' } : f
                            ));
                          }}
                          className={`type-button ${feature.status === 'good' ? 'active' : ''}`}
                        >
                          Good
                        </button>
                        <button
                          onClick={() => {
                            setFeatures(features.map(f =>
                              f.id === feature.id ? { ...f, status: 'needs-work' } : f
                            ));
                          }}
                          className={`type-button ${feature.status === 'needs-work' ? 'active' : ''}`}
                        >
                          Needs Work
                        </button>
                      </div>
                    </div>
                    <div className="year-installed">
                      <label>Year Installed</label>
                      <input
                        type="number"
                        value={feature.year}
                        onChange={(e) => {
                          setFeatures(features.map(f =>
                            f.id === feature.id ? { ...f, year: e.target.value } : f
                          ));
                        }}
                        placeholder="Year"
                        className="year-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div className="form-section">
              <h2>Media Gallery</h2>
              
              {/* Main Image Upload */}
              <div className="form-group">
                <label>Main Property Image</label>
                <div className="image-upload-container">
                  {mainImage && (
                    <div className="image-preview">
                      <img src={mainImage} alt="Main property" />
                    </div>
                  )}
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="file-input"
                      id="main-image"
                    />
                    <label htmlFor="main-image" className="upload-button">
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="gallery-container">
                {galleryImages.map((image, index) => (
                  <div key={index} className="gallery-image">
                    <img src={image} alt={`Gallery ${index + 1}`} />
                    <button
                      onClick={() => setGalleryImages(prev => 
                        prev.filter((_, i) => i !== index)
                      )}
                      className="remove-image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="file-input"
                    id="gallery-image"
                  />
                  <label htmlFor="gallery-image" className="upload-button">
                    <Plus className="w-4 h-4" />
                    Add Image
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="button-container">
            <button className="generate-button">
              Generate Template
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="preview-container">
          <div className="preview-content">
            <h2>Preview</h2>
            <div className="preview-wrapper">
              <div className="email-container">
                {mainImage && (
                  <div className="main-image">
                    <img src={mainImage} alt="Property preview" />
                  </div>
                )}
                <div className="property-title">
                  {formData.askingPrice || 'Property Price'}
                </div>
                <div className="property-address">
                  {formData.address || 'Property Address'}
                </div>
                <div className="property-details">
                  <div className="detail-row">
                    {formData.bedrooms && (
                      <div className="detail-item">
                        <div className="detail-label">Bedrooms</div>
                        <div className="detail-value">{formData.bedrooms}</div>
                      </div>
                    )}
                    {formData.bathrooms && (
                      <div className="detail-item">
                        <div className="detail-label">Bathrooms</div>
                        <div className="detail-value">{formData.bathrooms}</div>
                      </div>
                    )}
                    {formData.squareFootage && (
                      <div className="detail-item">
                        <div className="detail-label">Square Feet</div>
                        <div className="detail-value">{formData.squareFootage}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBuilder;