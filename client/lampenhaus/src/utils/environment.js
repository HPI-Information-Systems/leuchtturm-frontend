export default function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return '/app';
    }
    return '';
}
