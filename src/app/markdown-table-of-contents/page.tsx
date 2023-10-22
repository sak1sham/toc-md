import Toc from "@/components/md-toc";
import markdown from "./file.md";

import React from "react";

function Page() {
    return (
        <div className="">
            <Toc
                mdText={markdown}
                focussedItemStyle={{
                    color: "purple",
                    fontWeight: "bold",
                }}
                listStyle={{
                    listStyleType: "none",
                }}
                focussedHeadingId="installation"
                indent={20}
                ordered={true}
                highlightParent={true}
                onClickBehavior={{
                    jump: true,
                    smoothScroll: true,
                    updateUrlPath: true,
                }}
                maxLevel={3}
            />
        </div>
    );
}

export default Page;
