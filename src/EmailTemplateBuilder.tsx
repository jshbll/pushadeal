import React, { useState, ChangeEvent } from "react";
import { Menu, ChevronLeft, Calendar, Plus } from "lucide-react";
import { SquarePayment } from "./components/SquarePayment";
import { uploadToCloudinary } from "./services/cloudinary";

interface CompProperty {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CompData {
  address: CompProperty;
  status: string;
  listedDate: string;
  price: string;
  soldDate: string;
  daysOnMarket: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  acreage: string;
}

interface SystemSectionProps {
  system: keyof FormData;
  title: string;
  data: SystemCondition;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formData: FormData;
}

type SystemCondition = "Good" | "Needs Repair";

interface FormData {
  // Property Location
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;

  // Property Details
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  occupancyStatus: string;
  yearBuilt: string;
  foundation: SystemCondition;
  roof: SystemCondition;
  electrical: SystemCondition;
  plumbing: SystemCondition;
  hvac: SystemCondition;
  mainImage: File | null;
  mainImageUrl?: string;
  additionalImages: File[];
  additionalImageUrls: string[];

  // Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  approveEmail: boolean;

  // Investment Details
  salePrice: string;
  repairCosts: string;
  potentialProfit: string;
  comps: CompData[];

  // Email Approval
  recipientEmail: string;
  emailSubject: string;
}

const PropertyConditionForm = ({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const handleSystemChange =
    (system: "roof" | "hvac" | "plumbing") =>
    (updates: Partial<SystemCondition>) => {
      setFormData((prev) => ({
        ...prev,
        [system]: {
          ...prev[system],
          ...updates,
        },
      }));
    };

  const SYSTEM_CONFIGS = {
    roof: {
      title: "Roof",
      types: [
        "Unknown",
        "Asphalt Shingles",
        "Metal",
        "Tile",
        "Built-up",
        "Modified Bitumen",
        "TPO",
        "EPDM",
        "PVC",
        "Other",
      ],
    },
    hvac: {
      title: "HVAC",
      types: [
        "Unknown",
        "Central AC with Gas Furnace",
        "Central AC with Electric Heat",
        "Heat Pump",
        "Package Unit",
        "Mini-Split System",
        "Window Units",
        "Other",
      ],
    },
    plumbing: {
      title: "Plumbing",
      types: [
        "Unknown",
        "PVC",
        "Copper",
        "Galvanized",
        "PEX",
        "CPVC",
        "Cast Iron",
        "Other",
      ],
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Property Condition
      </h2>

      {(Object.keys(SYSTEM_CONFIGS) as Array<"roof" | "hvac" | "plumbing">).map(
        (system) => (
          <div
            key={system}
            className="p-6 border border-gray-200 rounded-xl space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {SYSTEM_CONFIGS[system].title}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData[system].type}
                  onChange={(e) =>
                    handleSystemChange(system)({ type: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all appearance-none"
                >
                  <option value="">Select Type</option>
                  {SYSTEM_CONFIGS[system].types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Installed/Replaced
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={formData[system].age || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                    if (value.length <= 4) {
                      handleSystemChange(system)({
                        age: value,
                        ageError: false, // Clear error on change
                      });
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value);
                    const currentYear = new Date().getFullYear();
                    if (
                      e.target.value.length === 4 &&
                      !isNaN(value) &&
                      value >= 1800 &&
                      value <= currentYear
                    ) {
                      // Value is valid, clear any error
                      handleSystemChange(system)({
                        ageError: false,
                      });
                    } else {
                      // Set error state and keep invalid value for user feedback
                      handleSystemChange(system)({
                        ageError: true,
                      });
                    }
                  }}
                  className={`w-full px-4 py-3.5 bg-gray-50 border ${
                    formData[system].ageError
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                  } rounded-xl text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                  placeholder="YYYY"
                />
                {formData[system].ageError && (
                  <p className="mt-1 text-sm text-red-500">
                    Year must be between 1800 and {new Date().getFullYear()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
  Condition
</label>
<div className="relative">
  <select
    value={formData[system]?.condition || ""} // Ensure condition defaults to an empty string
    onChange={(e) =>
      handleSystemChange(system)({
        condition: e.target.value as "Good" | "Needs Repair",
        ...(e.target.value === "Good" ? { repairDetails: "" } : {}),
      })
    }
    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all appearance-none"
  >
    <option value="" disabled>
      Select Condition
    </option>
    <option value="Good">Good</option>
    <option value="Needs Repair">Needs Repair</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
              {formData[system].condition === "Needs Repair" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repair Details
                  </label>
                  <textarea
                    value={formData[system].repairDetails || ""}
                    onChange={(e) =>
                      handleSystemChange(system)({
                        repairDetails: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all"
                    placeholder={`Please describe what repairs are needed for the ${system.toLowerCase()}`}
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

// Add this interface
const STEPS = [
  { id: "location", title: "Property Location" },
  { id: "details", title: "Property Details" },
  { id: "condition", title: "Property Condition" },
  { id: "investment", title: "Investment Details" },
  { id: "images", title: "Property Images" },
  { id: "preview", title: "Email Preview" },
  { id: "payment", title: "Payment" },
  { id: "send", title: "Send Email" },
];

const EmailTemplateBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("location");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    lotSize: 0,
    occupancyStatus: "",
    yearBuilt: "",
    foundation: "Good",
    roof: "Good",
    electrical: "Good",
    plumbing: "Good",
    hvac: "Good",
    mainImage: null,
    mainImageUrl: "",
    additionalImages: [],
    additionalImageUrls: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    approveEmail: false,
    salePrice: "",
    repairCosts: "",
    potentialProfit: "",
    comps: [
      {
        address: {
          street1: "",
          street2: "",
          city: "",
          state: "",
          zipCode: "",
        },
        status: "",
        listedDate: "",
        price: "",
        soldDate: "",
        daysOnMarket: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        acreage: "",
      },
    ],
    recipientEmail: "",
    emailSubject: "",
  });

  const MAX_ADDITIONAL_IMAGES = 10;

  const isEmptyOrZero = (value: string | number) => {
    if (typeof value === "string") {
      return !value || value.trim() === "" || value === "0";
    }
    return value === 0;
  };

  const formatCurrency = (value: string): string => {
    // Remove any existing commas and non-numeric characters except decimal
    const cleanValue = value.replace(/[^0-9.]/g, "");

    // Split into whole and decimal parts
    const parts = cleanValue.split(".");
    const whole = parts[0];
    const decimal = parts[1];

    // Add commas to whole number part
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Return with decimal if it exists
    return decimal ? `${withCommas}.${decimal}` : withCommas;
  };

  const generateEmailHtml = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Investment Property</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    [[trackingImage]]    
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1e293b;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: center; padding: 32px 20px;">
            <img src="https://staged.page/dealdispo/Dispo-Logo-Do-Not-Move-Delete.png" alt="Deal Dispo Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
          </td>
        </tr>

        <tr>
          <td style="padding: 0 32px;">
            <h1 style="margin: 0; color: #1e293b; font-size: 36px; font-weight: bold; text-align: center;">
              ${
                formData.salePrice
                  ? `$${formatCurrency(formData.salePrice)}`
                  : ""
              }
            </h1>
            <p style="margin: 8px 0 24px; color: #64748b; font-size: 18px; text-align: center;">
              ${`${formData.street1} ${formData.street2} ${formData.city}, ${formData.state} ${formData.zipCode}`.trim()}
            </p>
          </td>
        </tr>

        ${
          formData.mainImage || formData.additionalImages.length > 0
            ? `
        <tr>
          <td style="padding: 0 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${
                formData.mainImage
                  ? `
              <tr>
                <td style="padding-bottom: 24px;">
                  <img src="${formData.mainImageUrl}" alt="Main Property Image" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;" />
                </td>
              </tr>
              `
                  : ""
              }
              ${
                formData.additionalImages.length > 0
                  ? `
              <tr>
                <td>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                    ${formData.additionalImageUrls
                      .map(
                        (imageUrl, index) => `
                      <div style="padding-bottom: 16px;">
                        <img src="${imageUrl}" alt="Additional Property Image ${
                          index + 1
                        }" style="width: 100%; height: auto; border-radius: 8px;" />
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>
        `
            : ""
        }

        <tr>
          <td style="padding: 0 32px 24px;">
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  Property Details
                </th>
              </tr>
              ${
                !isEmptyOrZero(formData.propertyType)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Property Type
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formData.propertyType}
                </td>
              </tr>
              `
                  : ""
              }                        
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Bedrooms/Baths
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${`${formData.bedrooms} bed, ${formData.bathrooms} bath`}
                </td>
              </tr>
              ${
                !isEmptyOrZero(formData.squareFootage)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Square Footage
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formatCurrency(formData.squareFootage.toString())} sqft
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(formData.squareFootage)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Year Built
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formData.yearBuilt}
                </td>
              </tr>
                            `
                  : ""
              }
              ${
                !isEmptyOrZero(formData.lotSize)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Lot Size
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formData.lotSize} acres
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(formData.occupancyStatus)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Occupancy Status
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formData.occupancyStatus}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                formData.vacancyDate
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Vacancy Date
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${formData.vacancyDate}
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>

        ${
          !isEmptyOrZero(formData.repairCosts) ||
          !isEmptyOrZero(formData.potentialProfit)
            ? `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  Investment Details
                </th>
              </tr>
              ${
                !isEmptyOrZero(formData.repairCosts)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Repair Costs
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  $${formatCurrency(formData.repairCosts)}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(formData.potentialProfit)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Potential Profit
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  $${formatCurrency(formData.potentialProfit)}
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>
        `
            : ""
        }

        ${
          (formData.roof?.condition || formData.roof?.type || formData.roof?.age) ||
          (formData.hvac?.condition || formData.hvac?.type || formData.hvac?.age) ||
          (formData.plumbing?.condition || formData.plumbing?.type || formData.plumbing?.age)
            ? `
          <tr>
            <td style="padding: 0 32px 24px;">
              <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    Property Condition
                  </th>
                </tr>
                ${
                  formData.roof?.condition || formData.roof?.type || formData.roof?.age
                    ? `
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                      Roof
                    </td>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                      ${formData.roof.condition || ""} ${formData.roof.type || ""}${
                        formData.roof.age
                          ? `, ${new Date().getFullYear() - parseInt(formData.roof.age)} years old`
                          : ""
                      }
                    </td>
                  </tr>
                  `
                    : ""
                }
                ${
                  formData.hvac?.condition || formData.hvac?.type || formData.hvac?.age
                    ? `
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                      HVAC
                    </td>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                      ${formData.hvac.type || ""}${
                        formData.hvac.age
                          ? `, ${new Date().getFullYear() - parseInt(formData.hvac.age)} years old`
                          : ""
                      } ${formData.hvac.condition || ""}
                    </td>
                  </tr>
                  `
                    : ""
                }
                ${
                  formData.plumbing?.condition || formData.plumbing?.type || formData.plumbing?.age
                    ? `
                  <tr>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                      Plumbing
                    </td>
                    <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                      ${formData.plumbing.type || ""}${
                        formData.plumbing.age
                          ? `, ${new Date().getFullYear() - parseInt(formData.plumbing.age)} years old`
                          : ""
                      } ${formData.plumbing.condition || ""}
                    </td>
                  </tr>
                  `
                    : ""
                }
              </table>
            </td>
          </tr>
          `
            : ""
        }
        
        

        ${formData.comps
          .map((comp, index) =>
            comp.address.street1
              ? `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <th colspan="2" style="padding: 20px 16px; text-align: left; background-color: #f8fafc; color: #1e293b; font-size: 18px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  Comparable Property ${index + 1}
                </th>
              </tr>
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Address
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${`${comp.address.street1} ${comp.address.street2} ${comp.address.city}, ${comp.address.state} ${comp.address.zipCode}`.trim()}
                </td>
              </tr>
              ${
                !isEmptyOrZero(comp.price)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Price
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  $${formatCurrency(comp.price)}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(comp.status)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Status
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${comp.status}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(comp.listedDate)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Listed Date
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${comp.listedDate}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(comp.soldDate)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Sold Date
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${comp.soldDate}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(comp.daysOnMarket)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Days on Market
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${comp.daysOnMarket}
                </td>
              </tr>
              `
                  : ""
              }
              ${
                !isEmptyOrZero(comp.bedrooms) ||
                !isEmptyOrZero(comp.bathrooms) ||
                !isEmptyOrZero(comp.squareFeet) ||
                !isEmptyOrZero(comp.acreage)
                  ? `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  Property Details
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 16px; font-weight: 500;">
                  ${[
                    comp.bedrooms ? `${comp.bedrooms} BR` : "",
                    comp.bathrooms ? `${comp.bathrooms} BA` : "",
                    comp.squareFeet
                      ? `${formatCurrency(comp.squareFeet)} sqft`
                      : "",
                    comp.acreage ? `${comp.acreage} acres` : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>
        `
              : ""
          )
          .join("")}
        <tr>
          <td style="padding: 32px; text-align: center; background-color: #f8fafc;">
            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 600;">
              Ready to make an offer?
            </h2>
            <div style="color: #1e293b; font-size: 32px; font-weight: bold;">
              ${formData.phone || "904-335-8553"}
            </div>
          </td>
        </tr>
      </table>
    </div>
    </body>
    </html>
  `;
  };

  const sendEmail = async (recipientEmail: string) => {
    try {
      const emailHtml = generateEmailHtml();
      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailHtml,
          subject: `Property Details: ${formData.street1}`,
          listId: "8663e04a-d1c8-11ef-bde9-fa163e4037f6"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear the field from invalid fields if it was previously marked as invalid
    if (invalidFields.includes(field)) {
      setInvalidFields((prev) => prev.filter((f) => f !== field));
    }
  };

  const handleSystemChange = (
    system: "roof" | "hvac" | "plumbing",
    field: keyof SystemCondition,
    value: string | "Good" | "Needs Repair"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [system]: {
        ...prev[system],
        [field]: value,
      },
      approveEmail: false, // Uncheck approval when system details change
    }));
  };

  const handleCompChange = (
    index: number,
    field: keyof CompData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      comps: prev.comps.map((comp, i) =>
        i === index ? { ...comp, [field]: value } : comp
      ),
      approveEmail: false, // Uncheck approval when comp data changes
    }));
  };

  const handleCompAddressChange = (
    index: number,
    field: keyof CompProperty,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      comps: prev.comps.map((comp, i) =>
        i === index
          ? {
              ...comp,
              address: {
                ...comp.address,
                [field]: value,
              },
            }
          : comp
      ),
      approveEmail: false, // Uncheck approval when comp address changes
    }));
  };

  const handleFileChange =
    (field: "mainImage" | "additionalImages") =>
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      try {
        if (field === "mainImage") {
          const file = e.target.files[0];
          setFormData((prev) => ({
            ...prev,
            mainImage: file,
            approveEmail: false,
          }));

          // Upload to Cloudinary
          const imageUrl = await uploadToCloudinary(file);
          setFormData((prev) => ({
            ...prev,
            mainImageUrl: imageUrl,
          }));
        } else {
          const newFiles = Array.from(e.target.files);
          setFormData((prev) => ({
            ...prev,
            additionalImages: [...prev.additionalImages, ...newFiles].slice(
              0,
              MAX_ADDITIONAL_IMAGES
            ),
            approveEmail: false,
          }));

          // Upload new files to Cloudinary
          const uploadPromises = newFiles.map((file) =>
            uploadToCloudinary(file)
          );
          const urls = await Promise.all(uploadPromises);

          setFormData((prev) => ({
            ...prev,
            additionalImageUrls: [...prev.additionalImageUrls, ...urls].slice(
              0,
              MAX_ADDITIONAL_IMAGES
            ),
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // You might want to show an error notification here
      }
    };

  const addComp = () => {
    setFormData((prev) => ({
      ...prev,
      comps: [
        ...prev.comps,
        {
          address: {
            street1: "",
            street2: "",
            city: "",
            state: "",
            zipCode: "",
          },
          status: "",
          listedDate: "",
          price: "",
          soldDate: "",
          daysOnMarket: "",
          bedrooms: "",
          bathrooms: "",
          squareFeet: "",
          acreage: "",
        },
      ],
    }));
  };

  const deleteComp = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      comps: prev.comps.filter((_, index) => index !== indexToDelete),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
      additionalImageUrls: prev.additionalImageUrls.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addImage = () => {
    if (formData.additionalImages.length >= MAX_ADDITIONAL_IMAGES) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/heic";
    input.click();

    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files?.length) {
        setFormData((prev) => ({
          ...prev,
          additionalImages: [...prev.additionalImages, files[0]].slice(
            0,
            MAX_ADDITIONAL_IMAGES
          ),
        }));
      }
    };
  };

  const handleAdditionalImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newImages],
      }));
    }
  };

  const getCurrentStepIndex = () => {
    return STEPS.findIndex((step) => step.id === currentStep);
  };

  const navigateStep = (direction: "next" | "back") => {
    const currentIndex = getCurrentStepIndex();
    if (direction === "next" && currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    } else if (direction === "back" && currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | null;
    message: string;
  }>({ type: null, message: "" });

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: null, message: "" });
    }, 5000);
  };

  const handleSubmit = async () => {
    if (!paymentComplete) {
      setShowPayment(true);
      return;
    }

    // TODO: Add your email sending logic here
    console.log("Email sent!");
  };

  const handlePaymentSuccess = async () => {
    try {
      setRedirecting(true);
      
      const response = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailHtml: generateEmailHtml(),
          subject: formData.emailSubject || "Property Details"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to send email');
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      showNotification("success", "Email sent successfully!");

      await new Promise(resolve => setTimeout(resolve, 2000));

      setCurrentStep("send");
      setShowPayment(false);
      setRedirecting(false);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      showNotification("error", emailError.message || "Failed to send email. Please try again.");
      setRedirecting(false);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case "location":
        return (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Property Location
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street1}
                  onChange={(e) => handleInputChange("street1", e.target.value)}
                  className={`w-full px-4 py-3.5 bg-gray-50 border ${
                    invalidFields.includes("street1")
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                  placeholder="Enter property address"
                />
                {invalidFields.includes("street1") && (
                  <p className="mt-1 text-sm text-red-500">
                    Property address is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apt, Suite, Unit (optional)
                </label>
                <input
                  type="text"
                  value={formData.street2}
                  onChange={(e) => handleInputChange("street2", e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500"
                  placeholder="Enter apartment, suite, or unit number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`w-full px-4 py-3.5 bg-gray-50 border ${
                    invalidFields.includes("city")
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                  placeholder="Enter city"
                />
                {invalidFields.includes("city") && (
                  <p className="mt-1 text-sm text-red-500">City is required</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.state || stateSearchQuery}
                      onChange={(e) => {
                        setStateSearchQuery(e.target.value);
                        setIsStateDropdownOpen(true);
                      }}
                      onFocus={() => setIsStateDropdownOpen(true)}
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${
                        invalidFields.includes("state")
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                      placeholder="Search state..."
                    />
                    {isStateDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                        {filteredStates.map((state) => (
                          <div
                            key={state}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 text-[15px]"
                            onClick={() => {
                              handleInputChange("state", state);
                              setStateSearchQuery("");
                              setIsStateDropdownOpen(false);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {state}
                          </div>
                        ))}
                        {filteredStates.length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-[15px]">
                            No states found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {invalidFields.includes("state") && (
                    <p className="mt-1 text-sm text-red-500">
                      State is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={5}
                    value={formData.zipCode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^\d]/g, "")
                        .slice(0, 5);
                      handleInputChange("zipCode", value);
                      // Clear the error if it was previously shown
                      if (invalidFields.includes("zipCode")) {
                        setInvalidFields((prev) =>
                          prev.filter((f) => f !== "zipCode")
                        );
                      }
                    }}
                    onBlur={(e) => {
                      // Check for exactly 5 digits on blur
                      if (e.target.value.length !== 5) {
                        setInvalidFields((prev) => [...prev, "zipCode"]);
                      }
                    }}
                    className={`w-full px-4 py-3.5 bg-gray-50 border ${
                      invalidFields.includes("zipCode")
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                    placeholder="Enter ZIP code (5 digits)"
                  />
                  {invalidFields.includes("zipCode") && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter a valid 5-digit ZIP code
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case "details":
        return (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Property Details
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange("propertyType", e.target.value)
                  }
                  className={`w-full px-4 py-3.5 bg-gray-50 border ${
                    invalidFields.includes("propertyType")
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                >
                  <option value="">Select Type</option>
                  <option value="Single Family">Single Family</option>
                  <option value="Multi Family">Multi Family</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Condo">Condo</option>
                </select>
                {invalidFields.includes("propertyType") && (
                  <p className="mt-1 text-sm text-red-500">
                    Property type is required
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(
                          0,
                          (parseFloat(formData.bedrooms) || 0) - 1
                        );
                        handleInputChange("bedrooms", newValue.toString());
                      }}
                      className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-l-xl text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        handleInputChange("bedrooms", e.target.value)
                      }
                      className={`w-full px-4 py-3.5 bg-gray-50 border-t border-b ${
                        invalidFields.includes("bedrooms")
                          ? "border-red-500"
                          : "border-gray-200"
                      } text-center text-gray-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newValue =
                          (parseFloat(formData.bedrooms) || 0) + 1;
                        handleInputChange("bedrooms", newValue.toString());
                      }}
                      className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-r-xl text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      +
                    </button>
                  </div>
                  {invalidFields.includes("bedrooms") && (
                    <p className="mt-1 text-sm text-red-500">
                      Number of bedrooms is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(
                          0,
                          (parseFloat(formData.bathrooms) || 0) - 0.5
                        );
                        handleInputChange("bathrooms", newValue.toString());
                      }}
                      className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-l-xl text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        handleInputChange("bathrooms", e.target.value)
                      }
                      className={`w-full px-4 py-3.5 bg-gray-50 border-t border-b ${
                        invalidFields.includes("bathrooms")
                          ? "border-red-500"
                          : "border-gray-200"
                      } text-center text-gray-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newValue =
                          (parseFloat(formData.bathrooms) || 0) + 0.5;
                        handleInputChange("bathrooms", newValue.toString());
                      }}
                      className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-r-xl text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      +
                    </button>
                  </div>
                  {invalidFields.includes("bathrooms") && (
                    <p className="mt-1 text-sm text-red-500">
                      Number of bathrooms is required
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupancy Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.occupancyStatus}
                  onChange={(e) =>
                    handleInputChange("occupancyStatus", e.target.value)
                  }
                  className={`w-full px-4 py-3.5 bg-gray-50 border ${
                    invalidFields.includes("occupancyStatus")
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                >
                  <option value="">Select Status</option>
                  <option value="Owner Occupied">Owner Occupied</option>
                  <option value="Tenant Occupied">Tenant Occupied</option>
                  <option value="Vacant">Vacant</option>
                </select>
                {invalidFields.includes("occupancyStatus") && (
                  <p className="mt-1 text-sm text-red-500">
                    Occupancy status is required
                  </p>
                )}
              </div>

              {(formData.occupancyStatus === "Owner Occupied" ||
                formData.occupancyStatus === "Tenant Occupied") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Vacancy Date
                  </label>
                  <input
                    type="date"
                    value={formData.vacancyDate || ""}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("vacancyDate", e.target.value)
                    }
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.squareFootage || ""}
                      onChange={(e) =>
                        handleInputChange("squareFootage", e.target.value)
                      }
                      className="w-full px-4 pr-16 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-500 text-sm">
                      sq ft
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Size
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.lotSize || ""}
                      onChange={(e) =>
                        handleInputChange("lotSize", e.target.value)
                      }
                      className="w-full px-4 pr-16 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500"
                      placeholder="0.0"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-500 text-sm">
                      acres
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={formData.yearBuilt || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange("yearBuilt", value);
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (
                        isNaN(value) ||
                        value < 1800 ||
                        value > new Date().getFullYear() ||
                        e.target.value.length !== 4
                      ) {
                        handleInputChange("yearBuilt", "");
                      }
                    }}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500"
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case "condition":
        return (
          <div className="p-6">
            <PropertyConditionForm
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        );

      case "investment":
        return (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Investment Details
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asking Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={formData.salePrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      handleInputChange("salePrice", value);
                    }}
                    className={`w-full pl-8 pr-4 py-3.5 bg-gray-50 border ${
                      formData.salePriceError
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                    } rounded-xl text-gray-900 text-[15px] transition-all`}
                    placeholder="0"
                  />
                  {formData.salePriceError && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter numbers only
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Repairs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={formData.repairCosts}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      handleInputChange("repairCosts", value);
                    }}
                    className={`w-full pl-8 pr-4 py-3.5 bg-gray-50 border ${
                      formData.repairCostsError
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                    } rounded-xl text-gray-900 text-[15px] transition-all`}
                    placeholder="0"
                  />
                  {formData.repairCostsError && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter numbers only
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Profit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={formData.potentialProfit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      handleInputChange("potentialProfit", value);
                    }}
                    className={`w-full pl-8 pr-4 py-3.5 bg-gray-50 border ${
                      formData.potentialProfitError
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                    } rounded-xl text-gray-900 text-[15px] transition-all`}
                    placeholder="0"
                  />
                  {formData.potentialProfitError && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter numbers only
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case "images":
        return (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Property Images
            </h1>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Main Image
                </h3>
                <div className="relative border border-gray-300 rounded-xl p-4">
                  <input
                    type="file"
                    onChange={handleFileChange("mainImage")}
                    accept="image/jpeg,image/png,image/heic"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    File Types: jpg, png, heic
                  </p>
                </div>
                {formData.mainImage && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {formData.mainImage.name}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-medium text-gray-900">
                    Additional Images
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formData.additionalImages.length}/{MAX_ADDITIONAL_IMAGES}
                  </span>
                </div>

                <div className="space-y-4">
                  {formData.additionalImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Additional Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageUpload}
                      className="hidden"
                      id="additional-images"
                      multiple
                    />
                    <label
                      htmlFor="additional-images"
                      className="flex items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer"
                    >
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                          Add Images
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "preview":
        return (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Email Preview
            </h1>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: generateEmailHtml() }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  The following information will be used to contact you
                  regarding offers from investors.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="First"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full px-4 py-3.5 bg-gray-50 border ${
                          invalidFields.includes("firstName")
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                        placeholder="Enter first name"
                      />
                      {invalidFields.includes("firstName") && (
                        <p className="mt-1 text-sm text-red-500">
                          First name is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Last"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full px-4 py-3.5 bg-gray-50 border ${
                          invalidFields.includes("lastName")
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                        placeholder="Enter last name"
                      />
                      {invalidFields.includes("lastName") && (
                        <p className="mt-1 text-sm text-red-500">
                          Last name is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${
                        invalidFields.includes("email")
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                      placeholder="Enter email"
                    />
                    {invalidFields.includes("email") && (
                      <p className="mt-1 text-sm text-red-500">
                        Email is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="000-000-0000"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formattedValue = value
                          .slice(0, 10)
                          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
                          .replace(/(\d{3})(\d{3})/, "$1-$2");
                        setFormData((prev) => ({
                          ...prev,
                          phone: formattedValue,
                        }));
                        if (invalidFields.includes("phone")) {
                          setInvalidFields((prev) =>
                            prev.filter((f) => f !== "phone")
                          );
                        }
                      }}
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${
                        invalidFields.includes("phone")
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500`}
                      placeholder="Enter phone number"
                    />
                    {invalidFields.includes("phone") && (
                      <p className="mt-1 text-sm text-red-500">
                        Phone number is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium text-gray-900">
                    Email Content Approval
                  </h3>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.approveEmail}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          approveEmail: !prev.approveEmail,
                        }))
                      }
                      className="mt-1 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                      id="approve-email"
                    />
                    <label
                      htmlFor="approve-email"
                      className="text-sm text-gray-600"
                    >
                      I have reviewed and approve the email content above. This
                      is exactly what will be sent to investors.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "payment":
        return (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Your Purchase
              </h2>
              <p className="text-gray-600 mt-2">
                Your email will be sent after payment is processed
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <SquarePayment
                amount={19900}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        );

      case "send":
        return (
          <>
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-4 mx-auto w-fit mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mt-2">
                Your email will be sent shortly. We'll notify you once it's
                delivered.
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const isContactInfoComplete = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.street1 &&
      formData.city &&
      formData.state &&
      formData.zipCode
    );
  };

  const validateContactInfo = () => {
    const newInvalidFields = [];
    if (!formData.firstName) newInvalidFields.push("firstName");
    if (!formData.lastName) newInvalidFields.push("lastName");
    if (!formData.email) newInvalidFields.push("email");
    if (!formData.phone) newInvalidFields.push("phone");
    if (!formData.street1) newInvalidFields.push("street1");
    if (!formData.city) newInvalidFields.push("city");
    if (!formData.state) newInvalidFields.push("state");
    if (!formData.zipCode) newInvalidFields.push("zipCode");
    setInvalidFields(newInvalidFields);
    return newInvalidFields.length === 0;
  };

  const validatePropertyLocation = () => {
    const newInvalidFields = [];
    if (!formData.street1) newInvalidFields.push("street1");
    if (!formData.city) newInvalidFields.push("city");
    if (!formData.state) newInvalidFields.push("state");
    if (!formData.zipCode) newInvalidFields.push("zipCode");
    setInvalidFields(newInvalidFields);
    return newInvalidFields.length === 0;
  };

  const validatePropertyDetails = () => {
    const newInvalidFields = [];
    if (!formData.propertyType) newInvalidFields.push("propertyType");
    if (!formData.bedrooms) newInvalidFields.push("bedrooms");
    if (!formData.bathrooms) newInvalidFields.push("bathrooms");
    if (!formData.occupancyStatus) newInvalidFields.push("occupancyStatus");
    setInvalidFields(newInvalidFields);
    return newInvalidFields.length === 0;
  };

  const US_STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const filteredStates = US_STATES.filter((state) =>
    state.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const SystemSection = ({
    system,
    title,
    data,
    setFormData,
  }: {
    system: "roof" | "hvac" | "plumbing";
    title: string;
    data: SystemCondition;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  }) => {
    const systemTypes = {
      roof: [
        "Unknown",
        "Asphalt Shingles",
        "Metal",
        "Tile",
        "Built-up",
        "Modified Bitumen",
        "TPO",
        "EPDM",
        "PVC",
        "Other",
      ],
      hvac: [
        "Unknown",
        "Central AC with Gas Furnace",
        "Central AC with Electric Heat",
        "Heat Pump",
        "Package Unit",
        "Mini-Split System",
        "Window Units",
        "Other",
      ],
      plumbing: [
        "Unknown",
        "PVC",
        "Copper",
        "Galvanized",
        "PEX",
        "CPVC",
        "Cast Iron",
        "Other",
      ],
    };
    const handleChange = (field: keyof SystemCondition, value: string) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [system]: {
          ...prevFormData[system],
          [field]: value,
          ...(field === "condition" && value === "Good"
            ? { repairDetails: "" }
            : {}),
        },
      }));
    };

    return (
      // Make sure this return is inside the component function
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={data?.type || ""}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all appearance-none"
            >
              <option value="">Select Type</option>
              {systemTypes[system].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Installed/Replaced
            </label>
            <input
              type="text"
              value={data?.age || ""}
              onChange={(e) => handleChange("age", e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all"
              placeholder="Enter age"
            />
          </div>
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Condition
  </label>
  <select
    value={data?.condition || ""}
    onChange={(e) => handleChange("condition", e.target.value as "Good" | "Needs Repair")}
    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all appearance-none"
  >
    <option value="">Select Condition</option>
    <option value="Good">Good</option>
    <option value="Needs Repair">Needs Repair</option>
  </select>
  
  {data?.condition === "Needs Repair" && (
    <div className="mt-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Repair Details
      </label>
      <textarea
        value={data?.repairDetails || ""}
        onChange={(e) => handleChange("repairDetails", e.target.value)}
        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 text-[15px] transition-all placeholder:text-gray-500"
        placeholder={`Please describe what repairs are needed for the ${system.toLowerCase()}`}
        rows={3}
      />
    </div>
  )}
</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="PropPush" className="h-8" />
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-md transform transition ease-in-out duration-300">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md p-2 hover:bg-gray-100"
                  >
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 px-4 py-6">
                  <nav className="space-y-2">
                    <a
                      href="/"
                      className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Home
                    </a>
                    <a
                      href="/templates"
                      className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5"
                        />
                      </svg>
                      Templates
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            {renderStepContent()}
            <div className="mt-6 flex justify-end space-x-4">
              {getCurrentStepIndex() > 0 && (
                <button
                  onClick={() => {
                    if (currentStep === "payment") {
                      setFormData((prev) => ({ ...prev, approveEmail: false }));
                      setCurrentStep("preview");
                    } else {
                      navigateStep("back");
                    }
                  }}
                  className="px-6 py-3.5 text-blue-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <ChevronLeft className="inline-block w-5 h-5 mr-1" />
                  Back
                </button>
              )}
              {getCurrentStepIndex() < STEPS.length - 1 &&
                currentStep !== "payment" && (
                  <button
                    onClick={() => {
                      if (
                        currentStep === "location" &&
                        !validatePropertyLocation()
                      ) {
                        showNotification(
                          "error",
                          "Please fill in all required property location fields"
                        );
                        return;
                      }
                      if (
                        currentStep === "details" &&
                        !validatePropertyDetails()
                      ) {
                        showNotification(
                          "error",
                          "Please fill in all required property details"
                        );
                        return;
                      }
                      if (currentStep === "preview") {
                        if (!formData.approveEmail) {
                          showNotification(
                            "error",
                            "Please approve the email content before continuing"
                          );
                          return;
                        }
                        if (!validateContactInfo()) {
                          showNotification(
                            "error",
                            "Please fill in all required contact information fields"
                          );
                          return;
                        }
                        setCurrentStep("payment");
                      } else {
                        navigateStep("next");
                      }
                    }}
                    disabled={
                      currentStep === "preview"
                        ? formData.approveEmail && isContactInfoComplete()
                          ? false
                          : true
                        : false
                    }
                    className={`px-6 py-3.5 rounded-xl font-medium text-[15px] transition-all ${
                      currentStep === "preview"
                        ? formData.approveEmail && isContactInfoComplete()
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-100 text-gray-400"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {currentStep === "preview"
                      ? "Continue To Payment"
                      : "Continue"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBuilder;

