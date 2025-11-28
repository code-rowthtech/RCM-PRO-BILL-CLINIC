export const handleFirstSpace = (event, maxSpaces) => {
    const inputValue = event.target.value;
    // Prevent the first key from being a space
    if (inputValue === '' && event.key === ' ') {
        event.preventDefault();  // Prevent the space from being entered as the first character
        return;
    }
    // Prevent adding more than 2 spaces
    if (event.key === ' ') {
        const spaceCount = inputValue.split(' ').length - 1; // Count spaces in the input value
        if (spaceCount >= maxSpaces) {
            event.preventDefault();  // Prevent adding more than 2 spaces
        }
    }
    // Sanitize input: Remove emojis and special characters
    const sanitizedValue = inputValue.replace(/[^\w\s]|_/gi, '');
    event.target.value = sanitizedValue;  // Update the input value
};
