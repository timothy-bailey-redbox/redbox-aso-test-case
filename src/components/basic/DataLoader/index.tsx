import { type UseQueryResult } from "react-query";
import Spinner from "./Spinner";

type DataLoaderProps = React.PropsWithChildren<{
    query: UseQueryResult;
    hideReloads?: boolean;
}>;

export default function DataLoader({ query, children, hideReloads }: DataLoaderProps) {
    if (query.isLoading) {
        return <Spinner />;
    }
    if (query.isError) {
        return <div>{formatError(query.error)}</div>;
    }
    if (query.isRefetching && hideReloads) {
        return <Spinner />;
    }
    return children;
}

function formatError(error: unknown): string {
    if (error === null || error === undefined) {
        return "No error message provided";
    }
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "object" && "message" in error && typeof error.message === "string") {
        return error.message;
    }
    if (typeof error === "object" && "error" in error && typeof error.error === "string") {
        return error.error;
    }
    return JSON.stringify(error);
}
