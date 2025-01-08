import React, { useState, ReactNode, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
//import { Alert, AlertDescription } from '@/components/ui/alert';

const EmailTemplateBuilder = () => {
    // Email Content States
    const [customMessage, setCustomMessage] = useState('Insert Custom Message');
    const [footerMessage, setFooterMessage] = useState('Insert Footer Message.');
    const [logoUrl] = useState('https://staged.page/dealdispo/Dispo-Logo-Do-Not-Move-Delete.png');

    // Property Info States
    const [address, setAddress] = useState('Insert Property Address');
    const [squareFootage, setSquareFootage] = useState('');
    const [bedrooms, setBedrooms] = useState('0');
    const [baths, setBaths] = useState('0');
    const [lotSize, setLotSize] = useState('');
    const [yearBuilt, setYearBuilt] = useState('0000');
    const [marketValue, setMarketValue] = useState('000,000');
    const [arv, setArv] = useState('0');

    // Media States
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Investment Details States
    const [showInvestmentDetails, setShowInvestmentDetails] = useState(true);
    const [repairCosts, setRepairCosts] = useState('');
    const [profitMargin, setProfitMargin] = useState('');
    const [comparableProperties, setComparableProperties] = useState('');
    const [marketTrends, setMarketTrends] = useState('');
    const [phoneNumber] = useState('904-335-8553');

    // Modal States
    const [showHtmlModal, setShowHtmlModal] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [copiedHtml, setCopiedHtml] = useState(false);

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

    // Re-use all the handlers from the original code
    const handleItemChange = (id: string, field: keyof Item, value: string | boolean) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    // ... [Keep all the original handlers and helper functions] ...

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="w-full lg:flex">
                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-4">
                    <Tabs defaultValue="property" className="w-full">
                        <TabsList className="w-full flex justify-between overflow-x-auto mb-4">
                            <TabsTrigger value="property">Property</TabsTrigger>
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="investment">Investment</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        </TabsList>

                        {/* Property Tab */}
                        <TabsContent value="property">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Market Value
                                            </label>
                                            <input
                                                type="text"
                                                value={marketValue}
                                                onChange={handleMarketValueChange}
                                                placeholder="Current market value"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Property Address
                                            </label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Enter property address"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Main Image
                                        </label>
                                        <div className="space-y-2">
                                            {mainImageUrl && (
                                                <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                                                    <img 
                                                        src={mainImageUrl} 
                                                        alt="Main property" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleMainImageUpload}
                                                    className="flex-1"
                                                    id="main-image-upload"
                                                />
                                                <label 
                                                    htmlFor="main-image-upload"
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
                                                >
                                                    Upload
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Content Tab */}
                        <TabsContent value="content">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Custom Message
                                        </label>
                                        <textarea
                                            value={customMessage}
                                            onChange={(e) => setCustomMessage(e.target.value)}
                                            placeholder="Enter your custom message for the email"
                                            className="w-full p-2 border rounded-md min-h-[120px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Footer Message
                                        </label>
                                        <textarea
                                            value={footerMessage}
                                            onChange={(e) => setFooterMessage(e.target.value)}
                                            placeholder="Enter footer message"
                                            className="w-full p-2 border rounded-md min-h-[80px]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Details Tab */}
                        <TabsContent value="details">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Square Footage
                                            </label>
                                            <input
                                                type="text"
                                                value={squareFootage}
                                                onChange={(e) => setSquareFootage(e.target.value)}
                                                placeholder="e.g., 2,500 sq ft"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Bedrooms
                                            </label>
                                            <input
                                                type="number"
                                                value={bedrooms}
                                                onChange={(e) => setBedrooms(e.target.value)}
                                                placeholder="e.g., 4"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Bathrooms
                                            </label>
                                            <input
                                                type="number"
                                                value={baths}
                                                onChange={(e) => setBaths(e.target.value)}
                                                step="0.5"
                                                placeholder="e.g., 2.5"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Lot Size
                                            </label>
                                            <input
                                                type="text"
                                                value={lotSize}
                                                onChange={(e) => setLotSize(e.target.value)}
                                                placeholder="e.g., 0.25 acres"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Year Built
                                            </label>
                                            <input
                                                type="text"
                                                value={yearBuilt}
                                                onChange={(e) => setYearBuilt(e.target.value)}
                                                placeholder="e.g., 1985"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ARV
                                            </label>
                                            <input
                                                type="text"
                                                value={arv}
                                                onChange={handleArvChange}
                                                placeholder="After Repair Value"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Features Tab */}
                        <TabsContent value="features">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="p-4 border rounded-md">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.checked}
                                                            onChange={(e) => handleItemChange(item.id, 'checked', e.target.checked)}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="font-medium">{item.name}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{item.type}</span>
                                                </div>
                                                {item.checked && (
                                                    <div className="space-y-2 mt-2">
                                                        <input
                                                            type="text"
                                                            value={item.year || ''}
                                                            onChange={(e) => handleItemChange(item.id, 'year', e.target.value)}
                                                            placeholder="Year"
                                                            className="w-full p-2 border rounded-md"
                                                        />
                                                        <textarea
                                                            value={item.details || ''}
                                                            onChange={(e) => handleItemChange(item.id, 'details', e.target.value)}
                                                            placeholder="Details"
                                                            className="w-full p-2 border rounded-md"
                                                            rows={2}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Investment Tab */}
                        <TabsContent value="investment">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Repair Costs
                                            </label>
                                            <input
                                                type="text"
                                                value={repairCosts}
                                                onChange={handleRepairCostsChange}
                                                placeholder="e.g., $150,000"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Profit Margin
                                            </label>
                                            <input
                                                type="text"
                                                value={profitMargin}
                                                onChange={handleProfitMarginChange}
                                                placeholder="e.g., $175,000"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Market Trends
                                            </label>
                                            <input
                                                type="text"
                                                value={marketTrends}
                                                onChange={(e) => setMarketTrends(e.target.value)}
                                                placeholder="e.g., 8% annual appreciation"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Comparable Properties
                                            </label>
                                            <input
                                                type="text"
                                                value={comparableProperties}
                                                onChange={(e) => setComparableProperties(e.target.value)}
                                                placeholder="e.g., Similar properties in area"
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Gallery Tab */}
                        <TabsContent value="gallery">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {galleryImages.map((image, index) => (
                                            <div key={index} className="space-y-2">
                                                {image && (
                                                    <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                                                        <img 
                                                            src={image} 
                                                            alt={`Gallery image ${index + 1}`} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleGalleryImageUpload(e, index)}
                                                        className="flex-1"
                                                        id={`gallery-image-${index}`}
                                                    />
                                                    <label 
                                                        htmlFor={`gallery-image-${index}`}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
                                                    >
                                                        Upload
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setGalleryImages([...galleryImages, ''])}
                                        className="w-full p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Add Gallery Image
                                    </button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Generate HTML Button */}
                    <div className="mt-4 p-4">
                        <button 
                            onClick={() => setShowHtmlModal(true)}
                            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Generate HTML
                        </button>
                    </div>

                    {/* Preview Toggle for Mobile */}
                    <div className="lg:hidden mt-4">
                        <button 
                            onClick={() => setShowPreview(!showPreview)}
                            className="w-full p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className={`${showPreview ? 'block' : 'hidden'} lg:block lg:w-1/2 p-4 bg-white`}>
                    <div className="sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Email Preview</h2>
                        <div 
                            className="w-full bg-white rounded-md shadow-md overflow-auto"
                            style={{ maxHeight: 'calc(100vh - 8rem)' }}
                            dangerouslySetInnerHTML={{ 
                                __html: renderPreview()
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* HTML Modal */}
            {showHtmlModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Generated HTML</h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCopyHtml}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {copiedHtml ? 'Copied!' : 'Copy HTML'}
                                </button>
                                <button 
                                    onClick={() => setShowHtmlModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                                {generateEmailHtml(groupedItems, `${bedrooms} bed, ${baths} bath`)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplateBuilder;