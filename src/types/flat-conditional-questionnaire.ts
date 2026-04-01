import { BasicPriceCalculatorConfig } from "./pricing-calculator";

export interface FlatConditionalQuestionnaire {
    title: string;
    introPageParagraph: string;
    firstStepId: string;
    steps: FlatConditionalStep[];
    priceCalculator?: BasicPriceCalculatorConfig;
}

export interface FlatConditionalStep {
    stepId: string;
    componentType: 'textSelection' | 'radioSelection' | 'checkboxSelection' | 'imageSelection' | 'inputField';
    question: string;
    textOptions?: FlatTextOption[];
    radioOptions?: FlatRadioOption[];
    checkboxOptions?: FlatCheckboxOption[];
    imageOptions?: FlatImageOption[];
    inputConfig?: FlatInputConfig;
}


export interface FlatTextOption {
    text: string;
    enableTooltip?: boolean;
    content?: any;
    price?: number;
    nextStepId?: string;
    isLastStep?: boolean;
}

export interface FlatRadioOption {
    text: string;
    enableTooltip?: boolean;
    content?: any;
    price?: number;
    nextStepId?: string;
    isLastStep?: boolean;
}

export interface FlatCheckboxOption {
    text: string;
    enableTooltip?: boolean;
    content?: any;
    price?: number;
    nextStepId?: string;
    isLastStep?: boolean;
}

export interface FlatImageOption {
    image: {
        asset?: {
            url: string;
        };
        url?: string;
    };
    altText: string;
    enableTooltip?: boolean;
    content?: any;
    price?: number;
    nextStepId?: string;
    isLastStep?: boolean;
}

export interface FlatInputConfig {
    placeholder?: string;
    required?: boolean;
    price?: number;
    nextStepId?: string;
    isLastStep?: boolean;
}

export interface FlatFormAnswer {
    stepId: string;
    question: string;
    answer: string | number | number[];
    answerText?: string;
    answerImage?: string;
    price?: number; // Add price to track what was selected
}

export interface FlatStepHistory {
    stepId: string;
    step: FlatConditionalStep;
}



export interface FlatConditionalFormState {
    currentStepId: string | null;
    stepMap: Map<string, FlatConditionalStep>;
    answers: FlatFormAnswer[];
    stepHistory: FlatStepHistory[];
    isCompleted: boolean;
}

// Utility types for validation and debugging
export interface QuestionnaireValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    stats: {
        totalSteps: number;
        reachableSteps: number;
        unreachableSteps: number;
    };
}

export interface StepReference {
    fromStepId: string;
    toStepId: string;
    context: string; // e.g., "text option 1", "radio option 2", etc.
}

export interface QuestionnaireFlow {
    allPaths: string[][];
    averagePathLength: number;
    longestPath: string[];
    shortestPath: string[];
    totalEndpoints: number;
}

// Navigation types
export interface NavigationResult {
    success: boolean;
    nextStepId?: string;
    isCompleted?: boolean;
    error?: string;
}

// Helper type for step lookup
export type StepLookup = Map<string, FlatConditionalStep>;