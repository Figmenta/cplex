import { BasicPriceCalculatorConfig } from './pricing-calculator';

export interface MultiStepCalculator {
    _id: string;
    _type: string;
    title: string;
    firstStepId: string;
    priceCalculator: BasicPriceCalculatorConfig;
    steps: CalculatorStep[];
}

export interface CalculatorStep {
    stepId: string;
    stepName: string;
    stepQuestion?: string;
    enableConditionalStatement: boolean;
    stepConditionalStatement?: string;
    enableTooltip: boolean;
    content?: any; // You can define a more specific type if needed
    componentType: 'textSelection' | 'radioSelection' | 'checkboxSelection' | 'quantitySelection' | 'deadlineSelection';
    conditionalPriceDependentStep?: boolean;
    textOptions?: CalculatorTextOption[];
    radioOptions?: CalculatorRadioOption[];
    checkboxOptions?: CalculatorCheckboxOption[];
    quantityOptions?: CalculatorQuantityOption[];
    deadlineOptions?: CalculatorDeadlineOption[];
}

interface BaseOption {
    text: string;
    description?: string;
    price?: number;
    enableTooltip?: boolean;
    content?: any; // You can define a more specific type if needed
    nextStepId?: string;
    isLastStep?: boolean;
    conditionalPriceName?: string;
    enableConditionalPrice?: boolean;
    conditionalPrices?: ConditionalPrice[];
}

export interface CalculatorTextOption extends BaseOption {}

export interface CalculatorRadioOption extends BaseOption {}

export interface CalculatorCheckboxOption extends BaseOption {}

export interface CalculatorQuantityOption {
    title?: string;
    text: string;
    pricePerUnit: number;
    minQuantity: number;
    maxQuantity: number;
    defaultQuantity: number;
    enableTooltip?: boolean;
    content?: any; // You can define a more specific type if needed
    nextStepId?: string;
    isLastStep?: boolean;
    enableConditionalPrice?: boolean;
}

export interface DeadlineOptionItem {
    days: number;
    price?: number;
    isDefault: boolean;
    enableTooltip?: boolean;
    content?: any; // You can define a more specific type if needed
}

export interface CalculatorDeadlineOption {
    deadlineOptions: DeadlineOptionItem[];
    nextStepId?: string;
    isLastStep?: boolean;
    enableConditionalPrice?: boolean;
}

export interface CalculatorFormAnswer {
    stepId: string;
    stepName: string;
    componentType: string;
    answer: string | number | number[] | Record<number, number>;
    answerText?: string;
    price?: number;
    quantity?: number;
    quantities?: Record<number, number>;
    selectedDays?: number;
}

export interface CalculatorStepHistory {
    stepId: string;
    step: CalculatorStep;
}

export interface PriceEntry {
    stepId: string;
    optionText: string;
    price: number;
}

export interface UsePriceCalculatorReturn {
    priceEntries: PriceEntry[];
    currentTotal: number;
    isEnabled: boolean;
    addPrice: (entry: PriceEntry) => void;
    removeLastPrice: () => void;
    reset: () => void;
    formatPrice: (amount: number) => string;
    currency: string;
    basePrice: number;
}

export interface TempAnswer {
    stepId: string;
    question: string;
    answer: any;
    answerText: string;
    nextStepId: string | null;
    isLastStep: boolean;
    price: number;
    quantity?: number; // For single quantity selections
    quantities?: Record<number, number>; // For multiple quantity selections
    selectedDays?: number;
}

export interface PriceCalculatorDisplayProps {
    isEnabled: boolean;
    currentTotal: number;
    formatPrice: (amount: number) => string;
    priceEntries: PriceEntry[];
    isLastStep?: boolean;
    isComplete?: boolean;
    onSubmit?: () => void;
    totalSteps: number;
    currentStepId: string;
    steps: CalculatorStep[];
    onStepJump?: (stepId: string) => void;
}

export interface MultiStepCalculatorProps {
    calculatorData: MultiStepCalculator;
}

export interface ConditionalPrice {
    conditionalPriceName: string;
    price: number;
}

// Price calculation utilities
export const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
};

export const formatPrice = (amount: number, currency: string): string => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${amount.toLocaleString()}`;
};

// Helper type for step lookup
export type StepLookup = Map<string, CalculatorStep>;