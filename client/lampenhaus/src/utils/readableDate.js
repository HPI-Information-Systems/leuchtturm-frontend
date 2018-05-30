export default function readableDate(date) {
    const dateReadable = new Date(date);
    return dateReadable.toLocaleString(
        [],
        {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
    );
}
