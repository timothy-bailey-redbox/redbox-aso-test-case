import { useState } from "react";
import Icons from "~/components/basic/Icons";
import Modal from "~/components/basic/Modal";
import Button from "~/components/basic/inputs/Button";
import { useTeamCreate } from "~/queries/teams";
import useUserStore from "~/stores/user";
import EditTeam from "../EditTeam";

export default function AddTeamButton() {
    const [isOpen, setIsOpen] = useState(false);
    const createTeam = useTeamCreate();
    const user = useUserStore();

    if (!user.isAdmin) {
        return null;
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Icons.Add width={18} height={18} /> Create Team
            </Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="u-smallTitle" style={{ paddingBlockEnd: 24 }}>
                    Create new team
                </h2>
                <EditTeam
                    query={createTeam}
                    onSubmit={async (team) => {
                        const resp = await createTeam.mutateAsync({
                            name: team.name,
                            users: team.users,
                        });
                        if (!!resp.id) {
                            setIsOpen(false);
                        }
                    }}
                    buttonLabel="Create team"
                />
            </Modal>
        </>
    );
}
