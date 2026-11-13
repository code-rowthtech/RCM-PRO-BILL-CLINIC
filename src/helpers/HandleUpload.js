import { SHOWCASE_MESSAGE } from './showcase';

export const handleUpload = async (_file, setLoading) => {
    setLoading?.(false);
    window.alert(SHOWCASE_MESSAGE);
    return null;
};
