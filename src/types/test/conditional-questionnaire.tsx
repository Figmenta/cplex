// TypeScript types for conditional questionnaires

export interface ConditionalQuestionnaire {
    title: string;
    introPageParagraph: string;
    firstStep: ConditionalStep;
}

export interface ConditionalStep {
    stepId: string;
    componentType: 'textSelection' | 'radioSelection' | 'imageSelection' | 'inputField';
    question: string;
    textOptions?: ConditionalTextOption[];
    radioOptions?: ConditionalRadioOption[];
    imageOptions?: ConditionalImageOption[];
    inputConfig?: InputConfig;
}

export interface ConditionalTextOption {
    text: string;
    nextStep?: ConditionalStep;
    isLastStep?: boolean;
}

export interface ConditionalRadioOption {
    text: string;
    nextStep?: ConditionalStep;
    isLastStep?: boolean;
}

export interface ConditionalImageOption {
    image: {
        asset: {
            url: string;
        };
    };
    altText: string;
    nextStep?: ConditionalStep;
    isLastStep?: boolean;
}

export interface InputConfig {
    nextStep?: ConditionalStep;
    isLastStep?: boolean;
}

// Types for managing form state
export interface FormAnswer {
    stepId: string;
    question: string;
    answer: string | number;
    answerText?: string; // For display purposes
    answerImage?: string; // For image selections
}

export interface StepHistory {
    stepId: string;
    step: ConditionalStep;
}

export interface ConditionalFormState {
    currentStep: ConditionalStep | null;
    answers: FormAnswer[];
    stepHistory: StepHistory[];
    isCompleted: boolean;
}