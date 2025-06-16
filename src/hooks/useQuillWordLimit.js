import { useEffect, useState } from 'react';

export const useQuillWordLimit = (quillRef, { maxWords = 1000, maxWordLength = 45 } = {}) => {
    const [wordCount, setWordCount] = useState(0);
    const [longWord, setLongWord] = useState(null);

    useEffect(() => {
        if (!quillRef?.current) return;

        const editor = quillRef.current.getEditor();

        const handleTextChange = (delta, oldDelta, source) => {
            if (source !== 'user') return;

            const text = editor?.getText().trim();
            const words = text ? text.split(/\s+/).filter(Boolean) : [];
            const currentWordCount = words.length;

            // Find any word exceeding the length limit
            const exceededWord = words.find(word => word.length > maxWordLength);

            setWordCount(currentWordCount);
            setLongWord(exceededWord || null);

            if (currentWordCount > maxWords || exceededWord) {
                // Restore previous content
                editor.setContents(oldDelta);

                // Reset counts to previous state
                const prevText = oldDelta.ops.reduce((text, op) =>
                    text + (typeof op.insert === 'string' ? op.insert : ''),
                    '').trim();
                const prevWords = prevText ? prevText.split(/\s+/).filter(Boolean) : [];
                setWordCount(prevWords.length);
            }
        };

        editor?.on('text-change', handleTextChange);

        return () => {
            editor?.off('text-change', handleTextChange);
        };
    }, [quillRef, maxWords, maxWordLength]);

    const getWordStats = (content) => {
        const plainText = content?.replace(/<[^>]*>/g, '').trim() || '';
        const words = plainText.split(/\s+/).filter(Boolean);
        return {
            wordCount: words.length,
            hasLongWord: words.some(word => word.length > maxWordLength),
            longestWord: words.reduce((max, word) =>
                word.length > max.length ? word : max,
                ''),
        };
    };

    return {
        wordCount,
        longWord,
        getWordStats,
        maxWords,
        maxWordLength
    };
};
