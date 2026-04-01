interface TextOption {
    text: string;
}

interface ImageOption {
    asset: {
        url: string;
    };
}

interface BaseStep {
    question: string;
}

interface TextOptionStep extends BaseStep {
    options: TextOption[];
    isLastStep: boolean | null;
}

interface RadioSelectionStep extends BaseStep {
    options: TextOption[];
    isLastStep: boolean | null;
}

interface InputFieldStep extends BaseStep {
    isLastStep: boolean | null;
}

interface ImageSelectionStep extends BaseStep {
    options: ImageOption[];
    isLastStep: boolean | null;
}

type QuestionnaireStep =
    | TextOptionStep
    | RadioSelectionStep
    | InputFieldStep
    | ImageSelectionStep;

export interface QuestionnaireItem {
    title: string;
    introPageParagraph: string;
    steps: QuestionnaireStep[];
}

export type Questionnaires = QuestionnaireItem[];
