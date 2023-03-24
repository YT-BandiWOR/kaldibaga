import React from "react";

const ContentLine = ({text}) => {
    if (text) {
        return (
            <p>{text}</p>
        )
    } else {
        return (
            <br/>
        )
    }
}

export default ContentLine;