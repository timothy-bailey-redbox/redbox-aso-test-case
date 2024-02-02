import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError, type SubmitHandler } from "react-hook-form";
import { type Team, type TeamUpdate } from "types/team";
import { z } from "zod";
import ArrayInput from "~/components/basic/inputs/ArrayInput";
import Button from "~/components/basic/inputs/Button";
import Input from "~/components/basic/inputs/Input";
import { useTeamUpdate } from "~/queries/teams";
import styles from "./editteam.module.css";

type EditTeamProps = {
    team: Team;
};

export default function EditTeam({ team }: EditTeamProps) {
    const updateTeam = useTeamUpdate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TeamUpdate>({
        defaultValues: {
            name: team.name,
            users: team.users,
        },
        resolver: zodResolver(
            z.object({
                name: z.string().min(3, "Must be at least 3 characters").max(40, "No more that 40 characters"),
                users: z.array(z.string().email()),
            }),
        ),
    });

    const onSubmit: SubmitHandler<TeamUpdate> = async (data) => {
        await updateTeam.mutateAsync({
            id: team.id,
            update: {
                name: data.name,
                users: data.users,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
                label="Team name"
                error={errors.name?.message}
                defaultValue={team.name}
                {...register("name", { required: true })}
            />

            <ArrayInput
                label="Users"
                error={
                    Array.isArray(errors.users) ? errors.users.map((e: FieldError) => e.message) : errors.users?.message
                }
                defaultValue={team.users}
                {...register("users")}
                value={watch("users")}
                onChange={(value) => {
                    setValue("users", value);
                }}
            />

            <div style={{ textAlign: "right" }}>
                <Button type="submit" pending={updateTeam.isLoading}>
                    Save
                </Button>
            </div>
        </form>
    );
}
