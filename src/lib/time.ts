export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
export const week = day * 7;
export const year = day * 365;

export const seconds = (amount: number) => amount * second;
export const minutes = (amount: number) => amount * minute;
export const hours = (amount: number) => amount * hour;
export const days = (amount: number) => amount * day;
export const weeks = (amount: number) => amount * week;
export const years = (amount: number) => amount * year;

export async function delay(delay: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
