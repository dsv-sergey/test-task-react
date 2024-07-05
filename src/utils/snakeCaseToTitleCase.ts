export const snakeCaseToTitleCase = (input: string): string => {
    const words = input.split("_");

    if (words.length === 1) {
        // If there's only one word, capitalize the first letter and return
        return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    const [firstWord, ...restOfWords] = words;
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

    return [capitalizedFirstWord, ...restOfWords].flat().join(" ");
};
