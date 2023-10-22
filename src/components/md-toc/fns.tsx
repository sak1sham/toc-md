import React from "react";
import { Heading, ParsedHeading, TocProps } from "./datatypes";

const getIdFromHeading = (heading: string): string => {
    return heading
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const parseHeadingFromMDString = (
    inputArray: string[],
    index: number
): ParsedHeading | false => {
    // Use a regular expression to check the pattern and capture the number of hashes
    const pattern = /^([#]{1,6})\s(.*)/;
    const patternAlternateHeading1 = /^(=)\1+$/;
    const patternAlternateHeading2 = /^(-)\1+$/;
    const emphasisPattern = /[*_]/g;
    const match = inputArray[index].trim().match(pattern);
    if (match) {
        // Return an object with the count of hashes and the remaining text
        return {
            hashCount: match[1].length, // Length of the captured hash symbols
            text: match[2].replace(emphasisPattern, ""), // The remaining text (excluding the hash symbols and space)
        };
    } else if (
        index < inputArray.length - 1 &&
        inputArray[index + 1].trim().match(patternAlternateHeading1)
    ) {
        return {
            hashCount: 1,
            text: inputArray[index].trim().replace(emphasisPattern, ""),
        };
    } else if (
        index < inputArray.length - 1 &&
        inputArray[index + 1].trim().match(patternAlternateHeading2)
    ) {
        return {
            hashCount: 2,
            text: inputArray[index].trim().replace(emphasisPattern, ""),
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
        const heading = parseHeadingFromMDString(arr, i);
        if (!heading) {
            continue;
        } else {
            if (currentHashes === undefined) {
                currentHashes = heading.hashCount;
            }
            if (heading.hashCount < currentHashes) {
                // i.e. the current heading is a level up, so this level is complete, and we need to return
                return {
                    heads,
                    currentIndex: i,
                };
            } else if (heading.hashCount === currentHashes) {
                // i.e. we found another heading on the current level
                heads.push({
                    text: heading.text,
                    id: getIdFromHeading(heading.text),
                    level: currentLevel,
                    subHeadings: [],
                });
            } else if (heading.hashCount > currentHashes) {
                //  i.e. we found a next level, and should try to find more such subHeadings
                const subHeadings = getHeadings(
                    arr,
                    i,
                    currentLevel + 1,
                    heading.hashCount
                );
                // add these subHeadings to the last added heading
                heads[heads.length - 1].subHeadings = subHeadings.heads;
                // start where we left off
                i = subHeadings.currentIndex - 1;
            }
        }
    }
    return {
        heads,
        currentIndex: arr.length,
    };
};

const redirectToIdOnCurrentPage = (
    id: string,
    smoothScroll: boolean = false,
    updateUrlPathHash: boolean = true
) => {
    if (updateUrlPathHash) {
        window.location.hash = `#${id}`;
    } else {
        document?.getElementById(id)?.scrollIntoView({
            behavior: smoothScroll ? "smooth" : "auto",
        });
    }
    console.log("Redirecting to " + id);
};

const getFormattedHeadings = (
    heads: Heading[],
    props: TocProps
): {
    formattedHeading: JSX.Element;
    isFocussable: boolean;
} => {
    if (heads.length === 0) {
        return {
            formattedHeading: <></>,
            isFocussable: false,
        };
    } else if (props.maxLevel && heads[0].level > props.maxLevel) {
        return {
            formattedHeading: <></>,
            isFocussable: false,
        };
    }

    let indentation = `${props.indent || 0}px`;
    if (heads[0].level === 1) {
        indentation = "0px";
    }

    const listStyles: React.CSSProperties = {
        paddingLeft: indentation,
        listStylePosition: "inside",
        ...(props.listStyle || {}),
    };

    const listItemStyles: React.CSSProperties = {
        ...(props.listItemStyle || {}),
    };

    let isAnyHeadFocussed = false;

    const listItems = (
        <>
            {heads.map((head) => {
                const { formattedHeading: subHeadings, isFocussable } =
                    getFormattedHeadings(head.subHeadings, props);

                const isCurrentHeadFocussed = Boolean(
                    props.focussedHeadingId &&
                        props.focussedHeadingId === head.id
                );

                isAnyHeadFocussed =
                    isAnyHeadFocussed || isCurrentHeadFocussed || isFocussable;

                const listItemTextStyle: React.CSSProperties = {
                    ...(isCurrentHeadFocussed || isFocussable
                        ? props.focussedItemStyle || {}
                        : {}),
                    cursor: props.onClickBehavior ? "pointer" : "auto",
                };

                return (
                    <li key={head.id} id={head.id} style={listItemStyles}>
                        <span
                            style={listItemTextStyle}
                            onClick={
                                props.onClickBehavior?.jump
                                    ? () => {
                                          redirectToIdOnCurrentPage(
                                              head.id,
                                              props.onClickBehavior
                                                  ?.smoothScroll,
                                              props.onClickBehavior
                                                  ?.updateUrlPath
                                          );
                                      }
                                    : undefined
                            }
                        >
                            {head.text}
                        </span>
                        {subHeadings}
                    </li>
                );
            })}
        </>
    );

    if (props.ordered) {
        return {
            formattedHeading: <ol style={listStyles}> {listItems}</ol>,
            isFocussable: Boolean(props.highlightParent && isAnyHeadFocussed),
        };
    } else {
        return {
            formattedHeading: <ul style={listStyles}> {listItems}</ul>,
            isFocussable: Boolean(props.highlightParent && isAnyHeadFocussed),
        };
    }
};

export { getIdFromHeading, getHeadings, getFormattedHeadings };
