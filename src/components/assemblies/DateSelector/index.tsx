import Input from "~/components/basic/inputs/Input";
import useFilterStore from "~/stores/filter";
import styles from "./date.module.css";
import { formatDateForInput } from "~/lib/date";

export default function DateSelector() {
    const filters = useFilterStore();

    return (
        <div className={styles.wrapper}>
            <Input
                type="date"
                value={formatDateForInput(filters.from)}
                label="From"
                onChange={(e) => filters.setDateRange(valueToTimestamp(e.target.value), filters.to)}
            />
            <Input
                type="date"
                value={formatDateForInput(filters.to)}
                label="To"
                onChange={(e) => filters.setDateRange(filters.from, valueToTimestamp(e.target.value))}
            />
        </div>
    );
}

function valueToTimestamp(val: string): number {
    return new Date(val).getTime();
}
