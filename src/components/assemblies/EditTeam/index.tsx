import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { formatError } from "~/components/basic/DataLoader";
import ArrayInput from "~/components/basic/inputs/ArrayInput";
import Button from "~/components/basic/inputs/Button";
import Input from "~/components/basic/inputs/Input";
import { type useTeamCreate, type useTeamUpdate } from "~/queries/teams";
import { type Team, type TeamCreation, type TeamUpdate } from "~/types/team";
import styles from "./editteam.module.css";

type EditTeamProps = {
    team?: Team;
    query: ReturnType<typeof useTeamUpdate | typeof useTeamCreate>;
    onSubmit: SubmitHandler<TeamUpdate & TeamCreation>;
    buttonLabel?: string;
};

export default function EditTeam({ team, query, onSubmit, buttonLabel = "Save" }: EditTeamProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TeamUpdate & TeamCreation>({
        defaultValues: {
            name: team?.name ?? "",
            users: team?.users ?? [],
        },
        resolver: zodResolver(
            z.object({
                name: z.string().min(3, "Must be at least 3 characters").max(40, "No more that 40 characters"),
                users: z.array(z.string().email()),
            }),
        ),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input label="Team name" error={errors.name?.message} {...register("name", { required: true })} />

            <ArrayInput
                label="Users"
                error={
                    Array.isArray(errors.users) ? errors.users.map((e: FieldError) => e.message) : errors.users?.message
                }
                {...register("users")}
                value={watch("users")}
                onChange={(value) => {
                    setValue("users", value);
                }}
            />

            <div style={{ textAlign: "right" }}>
                {query.isError && <p style={{ paddingBlockEnd: 8 }}>{formatError(query.error)}</p>}
                <Button type="submit" pending={query.isLoading}>
                    {buttonLabel}
                </Button>
            </div>
        </form>
    );
}
