import { useRouter } from "next/router";

export default function useRouteTeamId(): string | null {
    const { query } = useRouter();
    if (typeof query.teamId === "string") {
        return query.teamId;
    }
    return null;
}
