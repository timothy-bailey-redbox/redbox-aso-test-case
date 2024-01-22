import { create } from "zustand";

export type FilterState = {
    from: number;
    to: number;
    setDateRange: (from: number, to: number) => void;
};

const useFilterStore = create<FilterState>()((set) => {
    return {
        from: new Date("2022-01-01").getTime(),
        to: new Date().getTime(),

        setDateRange: (from, to) => {
            set({
                from,
                to,
            });
        },
    };
});
export default useFilterStore;
