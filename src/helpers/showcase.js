// Public showcase only: no backend connection or production credentials.
export const SHOWCASE_MESSAGE = 'This feature is unavailable in the public showcase. Backend integrations have been removed.';
export function unavailable() {
    return Promise.reject(SHOWCASE_MESSAGE);
}
