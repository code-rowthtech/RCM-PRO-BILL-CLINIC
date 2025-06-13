import { useEffect, useCallback, useRef } from 'react';

const useQuillWordLimit = ({ quillRef, maxWords = 1000, maxWordLength = 45, onLimitExceed }) => {
    const skipFirstRun = useRef(true);

    const handleTextChange = useCallback(
        (delta, oldDelta, source) => {
            if (source !== 'user') return;

            const editor = quillRef?.current?.getEditor?.();
            const text = editor?.getText()?.trim() || '';
            const words = text?.split(/\s+/)?.filter(Boolean);

            const wordCount = words.length;
            const hasLongWord = words.some(word => word.length > maxWordLength);

            if (skipFirstRun.current) {
                skipFirstRun.current = false;
                return;
            }

            if (wordCount > maxWords || hasLongWord) {
                editor.setContents(oldDelta);

                onLimitExceed?.({
                    type: hasLongWord ? 'long-word' : 'too-many-words',
                    message: hasLongWord
                        ? `Words cannot be longer than ${maxWordLength} characters.`
                        : `Note cannot exceed ${maxWords} words.`,
                });
            }
        },
        [quillRef, maxWords, maxWordLength, onLimitExceed]
    );

    useEffect(() => {
        const editor = quillRef?.current?.getEditor?.();

        if (!editor) return;

        editor.on('text-change', handleTextChange);

        return () => {
            editor.off('text-change', handleTextChange);
        };
    }, [handleTextChange, quillRef]);
};

export default useQuillWordLimit;
