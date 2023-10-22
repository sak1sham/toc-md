/*
 * Copyright (c) 2023 Victor UI. All rights reserved.
 * Description: Component for rendering the table of contents for a markdown string.
 * Markdown documentation: https://www.markdownguide.org/basic-syntax/#emphasis
 */

"use client";

import { TocProps } from "./datatypes";
import { getIdFromHeading, getHeadings, getFormattedHeadings } from "./fns";

const Toc = (props: TocProps) => {
    let mdLines = props.mdText.split("\n");
    const headings = getHeadings(mdLines, 0, 1).heads;
    return getFormattedHeadings(headings, props).formattedHeading;
};

export default Toc;

export { getIdFromHeading };
