export default function readableDate(date) {
    const dateReadable = new Date(date);
    return dateReadable.toLocaleString();
}
