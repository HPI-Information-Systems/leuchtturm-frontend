export default function readableDate(date) {
    const dateReadable = new Date(date * 1000);
    return dateReadable.toLocaleString();
}
