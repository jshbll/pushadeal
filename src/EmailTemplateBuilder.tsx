import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Settings, PenTool, Image, Layout } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  status: 'good' | 'needs-work' | 'unset';
  year?: string;
}

const EmailTemplateBuilder = () => {
  // Core States
  const [activeTab, setActiveTab] = useState('details');
  const [salePrice, setSalePrice] = useState('');
  const [address, setAddress] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');

  // Features State
  const [features, setFeatures] = useState<Feature[]>([
    { id: '1', name: 'HVAC', status: 'unset' },
    { id: '2', name: 'Roof', status: 'unset' },
    { id: '3', name: 'Windows', status: 'unset' },
    { id: '4', name: 'Kitchen', status: 'unset' },
    { id: '5', name: 'Plumbing', status: 'unset' },
    { id: '6', name: 'Electrical', status: 'unset' }
  ]);

  // Media States
  const [mainImage, setMainImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Investment Details
  const [repairCosts, setRepairCosts] = useState('');
  const [arvEstimate, setArvEstimate] = useState('');
  const [profitMargin, setProfitMargin] = useState('');

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(Number(numeric));
    return formatted;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (type === 'main') {
      setMainImage(url);
    } else {
      setGalleryImages(prev => [...prev, url]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 justify-between">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Generate Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'details', icon: Layout, label: 'Property Details' },
                  { id: 'features', icon: PenTool, label: 'Features' },
                  { id: 'media', icon: Image, label: 'Media' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {activeTab === 'details' && (
                <>
                  {/* Property Details Card */}
                  <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">Property Details</h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Sale Price
                            </label>
                            <Input
                              value={salePrice}
                              onChange={(e) => setSalePrice(formatCurrency(e.target.value))}
                              className="bg-slate-900/50 border-white/10 text-white placeholder-gray-500
                                       focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Enter sale price"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Address
                            </label>
                            <Input
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="bg-slate-900/50 border-white/10 text-white placeholder-gray-500
                                       focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Enter property address"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Bedrooms
                            </label>
                            <Input
                              type="number"
                              value={bedrooms}
                              onChange={(e) => setBedrooms(e.target.value)}
                              className="bg-slate-900/50 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Bathrooms
                            </label>
                            <Input
                              type="number"
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              className="bg-slate-900/50 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Square Feet
                            </label>
                            <Input
                              value={squareFootage}
                              onChange={(e) => setSquareFootage(e.target.value)}
                              className="bg-slate-900/50 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Year Built
                            </label>
                            <Input
                              value={yearBuilt}
                              onChange={(e) => setYearBuilt(e.target.value)}
                              className="bg-slate-900/50 border-white/10 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Investment Details Card */}
                  <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">Investment Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Repair Costs
                          </label>
                          <Input
                            value={repairCosts}
                            onChange={(e) => setRepairCosts(formatCurrency(e.target.value))}
                            className="bg-slate-900/50 border-white/10 text-white"
                            placeholder="Estimated repairs"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            ARV Estimate
                          </label>
                          <Input
                            value={arvEstimate}
                            onChange={(e) => setArvEstimate(formatCurrency(e.target.value))}
                            className="bg-slate-900/50 border-white/10 text-white"
                            placeholder="After repair value"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Profit Margin
                          </label>
                          <Input
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(formatCurrency(e.target.value))}
                            className="bg-slate-900/50 border-white/10 text-white"
                            placeholder="Expected profit"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'features' && (
                <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Property Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {features.map(feature => (
                        <div
                          key={feature.id}
                          className="bg-slate-900/50 rounded-lg p-4 border border-white/10
                                   hover:border-blue-500/50 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-white font-medium">{feature.name}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setFeatures(features.map(f =>
                                    f.id === feature.id ? { ...f, status: 'good' } : f
                                  ));
                                }}
                                className={`px-3 py-1 rounded-md text-sm transition-all ${
                                  feature.status === 'good'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                }`}
                              >
                                Good
                              </button>
                              <button
                                onClick={() => {
                                  setFeatures(features.map(f =>
                                    f.id === feature.id ? { ...f, status: 'needs-work' } : f
                                  ));
                                }}
                                className={`px-3 py-1 rounded-md text-sm transition-all ${
                                  feature.status === 'needs-work'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                              >
                                Needs Work
                              </button>
                            </div>
                          </div>
                          <Input
                            placeholder="Year installed"
                            value={feature.year || ''}
                            onChange={(e) => {
                              setFeatures(features.map(f =>
                                f.id === feature.id ? { ...f, year: e.target.value } : f
                              ));
                            }}
                            className="bg-slate-900/50 border-white/10 text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'media' && (
                <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Media Gallery</h2>
                    
                    {/* Main Image Upload */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-400 mb-4">
                        Main Property Image
                      </label>
                      <div className="relative h-64 bg-slate-900/50 rounded-lg border-2 border-dashed border-white/10
                                    hover:border-blue-500/50 transition-all duration-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'main')}
                          className="hidden"
                          id="main-image"
                        />
                        <label
                          htmlFor="main-image"
                          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                        >
                          {mainImage ? (
                            <img
                            src={mainImage}
                            alt="Main property"
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <Camera className="w-12 h-12 text-gray-400 mb-4" />
                            <span className="text-gray-400">Click to upload main image</span>
                            <span className="text-gray-500 text-sm mt-2">
                              Recommended: 1200x800px or larger
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-4">
                      Gallery Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square bg-slate-900/50 rounded-lg overflow-hidden group"
                        >
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setGalleryImages(images => 
                              images.filter((_, i) => i !== index)
                            )}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/90 
                                     text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Image Button */}
                      <div className="aspect-square bg-slate-900/50 rounded-lg border-2 border-dashed 
                                    border-white/10 hover:border-blue-500/50 transition-all duration-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          className="hidden"
                          id="gallery-image"
                        />
                        <label
                          htmlFor="gallery-image"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-400 text-sm">Add Image</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>
                <div className="bg-white rounded-lg p-4">
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt="Property preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="space-y-4">
                    {salePrice && (
                      <h3 className="text-gray-900 text-xl font-bold">
                        {salePrice}
                      </h3>
                    )}
                    {address && (
                      <p className="text-gray-600">
                        {address}
                      </p>
                    )}
                    <div className="flex space-x-4 text-sm text-gray-500">
                      {bedrooms && <span>{bedrooms} beds</span>}
                      {bathrooms && <span>{bathrooms} baths</span>}
                      {squareFootage && <span>{squareFootage} sqft</span>}
                    </div>
                    {features.filter(f => f.status !== 'unset').length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-gray-900 font-medium mb-2">Features</h4>
                        <div className="space-y-2">
                          {features
                            .filter(f => f.status !== 'unset')
                            .map(feature => (
                              <div
                                key={feature.id}
                                className={`text-sm px-3 py-1 rounded-full inline-block mr-2 ${
                                  feature.status === 'good'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {feature.name}
                                {feature.year && ` (${feature.year})`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default EmailTemplateBuilder;