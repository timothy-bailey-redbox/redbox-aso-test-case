type Dateish = Date | number;

const getDateFormatter = (options?: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(undefined, { timeZone: "UTC", ...options });

export function formatDate(inputDate: Dateish, options?: Intl.DateTimeFormatOptions) {
    if (!inputDate) {
        return "-";
    }

    if (typeof inputDate === "number") {
        inputDate = new Date(inputDate);
    }

    if (!(inputDate instanceof Date)) {
        return "-";
    }

    const formatter = getDateFormatter(options);

    return formatter.format(inputDate);
}

export function localToUTC(val: Date | number): Date {
    if (val === null) {
        // @ts-expect-error - This isn't type safe but better for debugging
        return null;
    }
    const date = new Date(val);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
}

export function UTCToLocal(val: Date | number): Date {
    if (val === null) {
        // @ts-expect-error - This isn't type safe but better for debugging
        return null;
    }
    const date = new Date(val);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
}
