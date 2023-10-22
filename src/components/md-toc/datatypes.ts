interface Heading {
    text: string;
    id: string;
    level: number;
    subHeadings: Heading[];
}

interface ParsedHeading {
    hashCount: number;
    text: string;
}

interface TocProps {
    mdText: string;
    listStyle?: React.CSSProperties;
    listItemStyle?: React.CSSProperties;
    onClickBehavior?: {
        jump?: boolean;
        smoothScroll?: boolean;
        updateUrlPath?: boolean;
    };
    focussedHeadingId?: string;
    focussedItemStyle?: React.CSSProperties;
    highlightParent?: boolean;
    ordered?: boolean;
    indent?: number;
    maxLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export type { Heading, ParsedHeading, TocProps };
