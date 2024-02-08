import { create } from "zustand";
import { isClientSide } from "~/lib/context";

export type FilterState = {
    from: number;
    to: number;
    setDateRange: (from: number, to: number) => void;

    search: string;
    setSearch: (search: string) => void;
};

const STORE_DATE_KEY = "RB-ASO-filterDate";

const useFilterStore = create<FilterState>()((set) => {
    const initFrom = new Date();
    initFrom.setDate(initFrom.getDate() - 30);
    const initTo = new Date();

    const storedRange = getStoredDateRange();
    const { from, to } = storedRange ? storedRange : { from: initFrom.getTime(), to: initTo.getTime() };

    return {
        from,
        to,
        setDateRange: (from, to) => {
            sessionStorage.setItem(STORE_DATE_KEY, `${from},${to}`);
            set({
                from,
                to,
            });
        },

        search: "",
        setSearch: (search) =>
            set({
                search,
            }),
    };
});
export default useFilterStore;

function getStoredDateRange() {
    if (!isClientSide() || !("sessionStorage" in window)) {
        return null;
    }

    const storedData = sessionStorage.getItem(STORE_DATE_KEY);

    if (!storedData) {
        return null;
    }

    const [from, to] = storedData.split(",").map((n) => parseInt(n, 10)) as [number, number];

    if (isNaN(from) || isNaN(to)) {
        return null;
    }

    return {
        from,
        to,
    };
}
