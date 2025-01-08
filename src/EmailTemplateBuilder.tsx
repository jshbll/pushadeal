    import React, { useState, ReactNode, ChangeEvent } from 'react';
    import './EmailTemplateBuilder.css';

    type ItemType = 'feature' | 'repair';

    interface Item {
        id: string;
        name: string;
        type: ItemType;
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

        // Investment Details States
        const [showInvestmentDetails, setShowInvestmentDetails] = useState(true);
        const [repairCosts, setRepairCosts] = useState('');
        const [profitMargin, setProfitMargin] = useState('');
        const [comparableProperties, setComparableProperties] = useState('');
        const [marketTrends, setMarketTrends] = useState('');
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
            setItems((prevItems: Item[]) => 
                prevItems.map((item: Item) => 
                    item.id === id 
                        ? { ...item, [field]: value }
                        : item
                )
            );
        };

        const groupedItems = {
            'Features': items
        } as Record<string, Item[]>;

        // Image validation functions
        const validateImage = async (file: File, type: 'main' | 'gallery' | 'header' | 'background'): Promise<{ isValid: boolean; message?: string }> => {
            // Check file size (1MB = 5 * 1024 * 1024 bytes)
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                return { isValid: false, message: 'Image must be under 1MB in size' };
            }

            // Create an image object to check dimensions
            const img = new Image();
            const imageUrl = URL.createObjectURL(file);
            
            return new Promise((resolve) => {
                img.onload = () => {
                    URL.revokeObjectURL(imageUrl);
                    
                    switch (type) {
                        case 'main':
                        case 'gallery':
                            // Email width should be at least 600px
                            if (img.width < 600) {
                                resolve({ isValid: false, message: 'Image must be at least 600 pixels wide' });
                                return;
                            }
                            break;
                        case 'header':
                            // Header height should be less than 200px
                            if (img.height > 200) {
                                resolve({ isValid: false, message: 'Header image must be less than 200 pixels high' });
                                return;
                            }
                            break;
                        case 'background':
                            // Background image constraints
                            if (img.width > 2000) {
                                resolve({ isValid: false, message: 'Background image must be no more than 2,000 pixels wide' });
                                return;
                            }
                            if (img.height > 5000) {
                                resolve({ isValid: false, message: 'Background image must be no more than 5,000 pixels high' });
                                return;
                            }
                            break;
                    }
                    
                    resolve({ isValid: true });
                };
                
                img.onerror = () => {
                    URL.revokeObjectURL(imageUrl);
                    resolve({ isValid: false, message: 'Failed to load image' });
                };
                
                img.src = imageUrl;
            });
        };

        const fileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        };

    // services/cloudinary.ts
    const uploadImageToServer = async (file: File): Promise<string> => {
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dyvlwsrdl/image/upload';
        const UPLOAD_PRESET = 'email-template';
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
    
        try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
    
        if (!response.ok) {
            throw new Error('Upload failed');
        }
    
        const data = await response.json();
        return data.secure_url;
        } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
        }
    };

        const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                // Validate image dimensions and size
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                
                img.onload = async () => {
                    URL.revokeObjectURL(objectUrl);
                    
                    if (img.width < 600) {
                        alert('Main image must be at least 600 pixels wide');
                        return;
                    }
                    
                    if (file.size > 1 * 1024 * 1024) {
                        alert('Image must be under 1MB');
                        return;
                    }

                    try {
                        const imageUrl = await uploadImageToServer(file);
                        setMainImageUrl(imageUrl);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        alert('Error uploading image to server');
                    }
                };
                
                img.src = objectUrl;
            } catch (error) {
                console.error('Error handling image upload:', error);
                alert('Error uploading image');
            }
        };

        const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                // Validate image dimensions and size
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                
                await new Promise<void>((resolve, reject) => {
                    img.onload = async () => {
                        URL.revokeObjectURL(objectUrl);
                        
                        if (img.width < 600) {
                            alert(`Gallery image ${file.name} must be at least 600 pixels wide`);
                            reject(new Error('Invalid image width'));
                            return;
                        }
                        
                        if (file.size > 5 * 1024 * 1024) {
                            alert(`Gallery image ${file.name} must be under 5MB`);
                            reject(new Error('Invalid image size'));
                            return;
                        }

                        try {
                            const imageUrl = await uploadImageToServer(file);
                            const newImages = [...galleryImages];
                            newImages[index] = imageUrl;
                            setGalleryImages(newImages);
                            resolve();
                        } catch (error) {
                            console.error('Error uploading image:', error);
                            alert(`Failed to upload ${file.name}`);
                            reject(error);
                        }
                    };
                    
                    img.onerror = () => {
                        URL.revokeObjectURL(objectUrl);
                        alert(`Failed to load ${file.name}`);
                        reject(new Error('Error loading image'));
                    };
                    
                    img.src = objectUrl;
                });
            } catch (error) {
                console.error('Error handling image:', error);
                alert(`Error processing ${file.name}`);
            }
        };

        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            try {
                const templateData: any = {};
                
                if (mainImageUrl?.trim()) templateData.mainImage = mainImageUrl;
                const validGalleryImages = galleryImages.filter(img => img?.trim());
                if (validGalleryImages.length) templateData.galleryImages = validGalleryImages;
                if (marketValue?.trim()) templateData.marketValue = marketValue;
                if (address?.trim()) templateData.address = address;
                if (customMessage?.trim()) templateData.customMessage = customMessage;
                if (squareFootage?.trim()) templateData.squareFootage = squareFootage;
                
                if (bedrooms?.trim() && baths?.trim()) {
                    templateData.bedrooms = bedrooms;
                    templateData.baths = baths;
                }
                
                if (lotSize?.trim()) templateData.lotSize = lotSize;
                if (yearBuilt?.trim()) templateData.yearBuilt = yearBuilt;
                if (arv?.trim()) templateData.arv = arv;
                
                const checkedItems = items.filter(item => item.checked && item.name?.trim());
                if (checkedItems.length) templateData.items = checkedItems;
                if (footerMessage?.trim()) templateData.footerMessage = footerMessage;
        
                console.log('Template data:', templateData);
        
                const groupedItems = {
                    'Features': checkedItems
                } as Record<string, typeof items>;
        
                const html = generateEmailHtml(groupedItems, `${bedrooms} bed, ${baths} bath`);
                
                const textarea = document.createElement('textarea');
                textarea.value = html;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                alert('Email template copied to clipboard!');
            } catch (error) {
                console.error('Error:', error);
                alert('Error generating email template');
            }
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

        const handleArvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '') {
                setArv('');
            } else {
                const numericValue = value.replace(/[^0-9]/g, '');
                const formattedValue = numericValue ? `$${parseInt(numericValue).toLocaleString()}` : '';
                setArv(formattedValue);
            }
        };

        const handleRepairCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '') {
                setRepairCosts('');
            } else {
                const numericValue = value.replace(/[^0-9]/g, '');
                const formattedValue = numericValue ? `$${parseInt(numericValue).toLocaleString()}` : '';
                setRepairCosts(formattedValue);
            }
        };

        const handleProfitMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '') {
                setProfitMargin('');
            } else {
                const numericValue = value.replace(/[^0-9]/g, '');
                const formattedValue = numericValue ? `$${parseInt(numericValue).toLocaleString()}` : '';
                setProfitMargin(formattedValue);
            }
        };

        // Helper function to check if a value is empty or zero
        const isEmptyOrZero = (value: string) => {
            return !value || value.trim() === '' || value === '$0' || value === '0' || value === '$0.00';
        };


        const generateEmailStyles = () => {
            return `
                body {
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    font-family: Arial, Helvetica, sans-serif;
                }

                .email-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .property-title {
                    margin: 0;
                    padding: 40px 40px 10px;
                    color: #2C3E50;
                    font-size: 36px;
                    font-weight: bold;
                    text-align: center;
                }

                .property-address {
                    margin: 0;
                    padding: 0 40px 20px;
                    color: #7F8C8D;
                    font-size: 16px;
                    text-align: center;
                }

                .main-image {
                    padding: 0 40px;
                }

                .main-image img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .content-section {
                    padding: 20px 40px;
                    color: #333;
                    line-height: 1.6;
                }

                .content-section p {
                    margin: 0 0 15px;
                }

                .property-details {
                    padding: 20px 40px;
                    background: #f8f9fa;
                }

                .detail-row {
                    display: flex;
                    margin-bottom: 15px;
                }

                .detail-row:last-child {
                    margin-bottom: 0;
                }

                .detail-item {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                }

                .detail-label {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                .detail-value {
                    color: #333;
                    font-size: 18px;
                    font-weight: bold;
                }

                .section {
                    padding: 20px 40px;
                    border-top: 1px solid #eee;
                }

                .section-title {
                    text-align: center;
                    color: #333;
                    font-size: 24px;
                    margin: 0 0 20px;
                }

                .items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    padding: 0;
                }

                .item {
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }

                .feature {
                    background-color: #E8F5E9;
                }

                .repair {
                    background-color: #FFF3E0;
                }

                .item-name {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .item-year {
                    color: #666;
                    font-size: 14px;
                }

                .item-details {
                    margin-top: 8px;
                    font-size: 14px;
                }

                .cta-section {
                    text-align: center;
                    padding: 30px 40px;
                    background: white;
                }

                .cta-title {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .cta-phone {
                    color: #333;
                    font-size: 32px;
                    font-weight: bold;
                }

                .footer-section {
                    padding: 20px 40px;
                    background: #f8f9fa;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }

                .footer-section p {
                    margin: 0 0 10px;
                }

                .footer-section p:last-child {
                    margin: 0;
                }

                @media (max-width: 600px) {
                    body {
                        padding: 10px;
                    }

                    .email-container {
                        border-radius: 0;
                    }

                    .items-grid {
                        grid-template-columns: 1fr;
                    }

                    .detail-row {
                        flex-direction: column;
                    }

                    .detail-item {
                        margin-bottom: 15px;
                    }

                    .detail-item:last-child {
                        margin-bottom: 0;
                    }

                    .property-title,
                    .property-address,
                    .main-image,
                    .content-section,
                    .property-details,
                    .section,
                    .cta-section,
                    .footer-section {
                        padding-left: 20px;
                        padding-right: 20px;
                    }
                }
            `;
        };

        const generateEmailHtml = (groupedItems: Record<string, typeof items>, bedroomsBaths: string) => {
            return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Investment Property</title>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            [[trackingImage]]
                <table style="width: 100%; max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    ${logoUrl ? `
                    <tr>
                        <td style="text-align: center; padding: 32px 20px;">
                            <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
                        </td>
                    </tr>
                    ` : ''}
                    
                    <tr>
                        <td style="padding: 0 32px;">
                            <h1 style="margin: 0; color: #1e293b; font-size: 36px; font-weight: bold; text-align: center;">${marketValue}</h1>
                            <p style="margin: 8px 0 24px; color: #64748b; font-size: 18px; text-align: center;">${address}</p>
                        </td>
                    </tr>
        
                    ${mainImageUrl ? `
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            <img src="${mainImageUrl}" alt="Main property image" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" />
                        </td>
                    </tr>
                    ` : ''}
        
                    ${customMessage ? `
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            ${customMessage.split('\n').map(paragraph => 
                                paragraph ? `<p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">${paragraph}</p>` : ''
                            ).join('')}
                        </td>
                    </tr>
                    ` : ''}
        
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <tr>
                                    <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">Property Details</th>
                                </tr>    
                                <tr>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Bedrooms/Baths</td>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${bedroomsBaths}</td>
                                </tr>
                                ${!isEmptyOrZero(squareFootage) ? `
                                <tr>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 40%;">Square Footage</td>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${squareFootage}</td>
                                </tr>
                                ` : ''}
                                ${!isEmptyOrZero(lotSize) ? `
                                <tr>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Lot Size</td>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${lotSize}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Year Built</td>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${yearBuilt}</td>
                                </tr>                                
                            </table>
                        </td>
                    </tr>
        
                    ${(!isEmptyOrZero(repairCosts) || !isEmptyOrZero(profitMargin) || !isEmptyOrZero(comparableProperties) || !isEmptyOrZero(marketTrends) || !isEmptyOrZero(marketValue) || !isEmptyOrZero(arv))  ? `
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <tr>
                                    <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">Investment Details</th>
                                </tr>
                                <tr>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Sale Price</td>
                                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${marketValue}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 16px; color: #64748b; font-size: 14px;">ARV</td>
                                    <td style="padding: 16px; color: #1e293b; font-size: 16px; font-weight: 500;">${arv}</td>
                                </tr>
                                ${!isEmptyOrZero(repairCosts) ? `
                                <tr>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 40%;">Repair Costs</td>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${repairCosts}</td>
                                </tr>
                                ` : ''}
                                ${!isEmptyOrZero(profitMargin) ? `
                                <tr>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Profit Margin</td>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${profitMargin}</td>
                                </tr>
                                ` : ''}
                                ${!isEmptyOrZero(marketTrends) ? `
                                <tr>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">Market Trends</td>
                                    <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">${marketTrends}</td>
                                </tr>
                                ` : ''}
                            </table>
                        </td>
                    </tr>
                    ` : ''}
        
                    ${(() => {
                        const checkedItems = groupedItems['Features'].filter(item => item.checked);
                        return checkedItems.length > 0 ? `
                            <tr>
                                <td style="padding: 0 32px 24px;">
                                    <table style="width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <tr>
                                            <th colspan="3" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                                Features
                                            </th>
                                        </tr>
                                        ${checkedItems.map(item => `
                                        <tr style="border-top: 1px solid #e2e8f0; background-color: #f0fdf4;">
                                            <td style="padding: 16px; font-weight: 600; color: #1e293b; width: 25%;">${item.name}</td>
                                            <td style="padding: 16px; color: #64748b; font-size: 14px; width: 15%; text-align: left;">${item.year || ''}</td>
                                            <td style="padding: 16px; color: #334155; font-size: 14px; width: 60%;">${item.details || ''}</td>
                                        </tr>
                                        `).join('')}
                                    </table>
                                </td>
                            </tr>
                        ` : '';
                    })()}
                    
                    ${galleryImages.length > 0 ? `
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 600;">Property Gallery</h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                                ${galleryImages.map(image => `
                                <div style="background-color: #ffffff; padding: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <img src="${image}" alt="Property gallery image" style="width: 100%; height: auto; border-radius: 4px;" />
                                </div>
                                `).join('')}
                            </div>
                        </td>
                    </tr>
                    ` : ''}
        
                    <tr>
                        <td style="padding: 32px; text-align: center; background-color: #f8fafc;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 600;">Ready to make an offer?</h2>
                            <div style="color: #1e293b; font-size: 32px; font-weight: bold;">${phoneNumber}</div>
                        </td>
                    </tr>
        
                    ${footerMessage ? `
                    <tr>
                        <td style="padding: 24px 32px; background-color: #f1f5f9; text-align: center;">
                            ${footerMessage.split('\n').map(line => 
                                line ? `<p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">${line}</p>` : ''
                            ).join('')}
                        </td>
                    </tr>
                    ` : ''}
                </table>
            </body>
            </html>`;
        };

        const handleGenerateClick = () => {
            const checkedItems = items.filter(item => item.checked);
            const groupedItems = checkedItems.reduce((acc, item) => {
                const title = item.type === 'feature' ? 'Features' : 'Required Repairs';
                if (!acc[title]) acc[title] = [];
                acc[title].push(item);
                return acc;
            }, {} as Record<string, typeof items>);

            const bedroomsBaths = `${bedrooms} bed, ${baths} bath`;
            const html = generateEmailHtml(groupedItems, bedroomsBaths);
            setGeneratedHtml(html);
            setShowHtmlModal(true);
        };

        const downloadHtml = () => {
            // Group checked items by type
            const checkedItems = items.filter(item => item.checked);
            const groupedItems = {
                'Features': checkedItems
            } as Record<string, typeof items>;

            const bedroomsBaths = `${bedrooms} bed / ${baths} bath`;
            const template = generatePreviewTemplate(groupedItems, bedroomsBaths);
            const blob = new Blob([template], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'email-template.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        const renderPreview = () => {
            const checkedItems = items.filter(item => item.checked);
            const groupedItems = {
                'Features': checkedItems
            } as Record<string, typeof items>;

            const bedroomsBaths = `${bedrooms} bed, ${baths} bath`;
            return generateEmailHtml(groupedItems, bedroomsBaths);
        };

        const [showHtmlModal, setShowHtmlModal] = useState(false);
        const [generatedHtml, setGeneratedHtml] = useState('');
        const [copiedHtml, setCopiedHtml] = useState(false);

        const handleCopyHtml = () => {
            const emailHtml = generateEmailHtml(groupedItems, `${bedrooms} bed, ${baths} bath`);
            navigator.clipboard.writeText(emailHtml).then(() => {
                setCopiedHtml(true);
                setTimeout(() => setCopiedHtml(false), 2000);
            });
        };

        interface ModalProps {
            isOpen: boolean;
            onClose: () => void;
            children: ReactNode;
        }

        const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
            if (!isOpen) return null;

            return (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ color: '#333', background: '#fff', position: 'relative', padding: '20px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button 
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                        >
                            ×
                        </button>
                        <div style={{ marginTop: '20px' }}>
                            {children}
                        </div>
                    </div>
                </div>
            );
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
                                        placeholder="e.g., 2,500 sq ft"
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bedrooms</label>
                                    <input
                                        type="number"
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                        placeholder="e.g., 4"
                                        min="0"
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bathrooms</label>
                                    <input
                                        type="number"
                                        value={baths}
                                        onChange={(e) => setBaths(e.target.value)}
                                        placeholder="e.g., 3"
                                        min="0"
                                        step="0.5"
                                        className="input"
                                    />
                                </div>
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
                                        placeholder="e.g., 1985"
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>After Repair Value (ARV)</label>
                                    <input
                                        type="text"
                                        value={arv}
                                        onChange={handleArvChange}
                                        placeholder="e.g., $1,200,000"
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section features-repairs">
                            <h2>Features</h2>
                            <div className="category-section">
                                {items.map((item) => (
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
                        </div>

                        <div className="form-section">
                            <h2>Investment Details</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Repair Costs</label>
                                    <input
                                        type="text"
                                        value={repairCosts}
                                        onChange={handleRepairCostsChange}
                                        placeholder="e.g., $150,000"
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Profit Margin</label>
                                    <input
                                        type="text"
                                        value={profitMargin}
                                        onChange={handleProfitMarginChange}
                                        placeholder="e.g., $175,000"
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Market Trends</label>
                                    <input
                                        type="text"
                                        value={marketTrends}
                                        onChange={(e) => setMarketTrends(e.target.value)}
                                        placeholder="e.g., 8% annual appreciation"
                                        className="input"
                                    />
                                </div>
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
                                        {image && (
                                            <div className="image-preview">
                                                <img src={image} alt="Gallery image" />
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setGalleryImages([...galleryImages, ''])}
                                className="upload-button"
                            >
                                Add Gallery Image
                            </button>
                        </div>

                        <div className="button-container">
                            <button onClick={() => setShowHtmlModal(true)} className="generate-button">
                                Generate HTML
                            </button>
                        </div>
                    </div>
                </div>

                <div className="preview-container">
                    <div className="preview-content">
                        <h2>Email Preview</h2>
                        <div 
                            className="preview-wrapper"
                            dangerouslySetInnerHTML={{ 
                                __html: renderPreview()
                            }} 
                        />
                    </div>
                </div>

                <Modal isOpen={showHtmlModal} onClose={() => setShowHtmlModal(false)}>
                    <div style={{ marginBottom: '20px', position: 'sticky', top: '0', background: '#fff', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <button 
                            onClick={handleCopyHtml}
                            style={{
                                padding: '8px 16px',
                                background: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {copiedHtml ? 'Copied!' : 'Copy HTML'}
                        </button>
                    </div>
                    <pre style={{ 
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '4px',
                        color: '#333',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}>
                        {generateEmailHtml(groupedItems, `${bedrooms} bed, ${baths} bath`)}
                    </pre>
                </Modal>
            </div>
        );
    };

    export default EmailTemplateBuilder;
