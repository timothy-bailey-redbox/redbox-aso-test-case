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
    const from = new Date();
    from.setDate(from.getDate() - 30);

    const storedRangeData = isClientSide() && "sessionStorage" in window && sessionStorage.getItem(STORE_DATE_KEY);
    const initRange: [number, number] = storedRangeData
        ? (storedRangeData.split(",").map(parseInt) as [number, number])
        : [from.getTime(), new Date().getTime()];

    return {
        from: initRange[0],
        to: initRange[1],
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
