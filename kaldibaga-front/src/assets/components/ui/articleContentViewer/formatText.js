const formatText = (text) => {
    const regex = /\/(title|p|q|r|g|b|y|hr) ([^/]+)\//g;
    const formattedText = [];

    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text))) {
        const matchIndex = match.index;
        const matchText = match[2];

        if (matchIndex > lastIndex) {
            formattedText.push({ type: "text", text: text.substring(lastIndex, matchIndex) });
        }

        formattedText.push({ type: match[1], text: matchText });

        lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < text.length) {
        formattedText.push({ type: "text", text: text.substring(lastIndex) });
    }

    return formattedText;
}

export default formatText;