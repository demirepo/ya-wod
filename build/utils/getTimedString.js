export function getTimedString(str) {
    const timedate = new Date();
    const time = timedate.toLocaleTimeString("ru-Ru");
    const date = timedate.toLocaleDateString("ru-Ru", { dateStyle: "long" });
    return `${date} ${time}   ${str}`;
}
