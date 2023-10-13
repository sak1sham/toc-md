"use client";

import React from "react";

interface Heading {
    text: string;
    id: string;
    level: number;
    subHeadings: Heading[];
}

const getIdFromHeading = (heading: string): string => {
    return heading
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const getHeadingFromMDString = (
    input: string
):
    | {
          count: number;
          heading: string;
      }
    | false => {
    // Use a regular expression to check the pattern and capture the number of hashes
    const pattern = /^([#]{1,6})\s(.*)/;
    const match = input.match(pattern);
    if (match) {
        // Return an object with the count of hashes and the remaining text
        return {
            count: match[1].length, // Length of the captured hash symbols
            heading: match[2], // The remaining text (excluding the hash symbols and space)
        };
    } else {
        return false; // Return null if the pattern doesn't match
    }
};

const getHeadings = (
    arr: string[],
    currentIndex: number,
    currentLevel: number,
    currentHashes?: number
) => {
    const heads: Heading[] = [];
    for (let i = currentIndex; i < arr.length; i++) {
        const heading = getHeadingFromMDString(arr[i].trim());
        if (!heading) {
            continue;
        } else {
            if (currentHashes === undefined) {
                currentHashes = heading.count;
            }
            if (heading.count < currentHashes) {
                return {
                    heads,
                    currentIndex: i,
                };
            } else if (heading.count === currentLevel) {
                heads.push({
                    text: heading.heading,
                    id: getIdFromHeading(heading.heading),
                    level: currentLevel,
                    subHeadings: [],
                });
            } else if (heading.count > currentLevel) {
                const subHeadings = getHeadings(
                    arr,
                    i,
                    currentLevel + 1,
                    heading.count
                );
                heads[-1].subHeadings = subHeadings.heads;
                i = currentLevel - 1;
            }
        }
    }
    return {
        heads,
        currentIndex: arr.length,
    };
};

interface TocProps {
    mdText: string;
    className?: string;
    customIdGenerator?: (heading: string) => string;
    focussedHeadingId?: string;
    focussedClassName?: string;
}

const Toc = (props: TocProps) => {
    let mdLines = props.mdText.split("\n");
    const headings = getHeadings(mdLines, 0, 1);
    return <div></div>;
};

export default Toc;

export { getIdFromHeading };
