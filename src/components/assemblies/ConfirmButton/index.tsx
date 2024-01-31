import { useState } from "react";
import { type UseMutationResult } from "react-query";
import { formatError } from "~/components/basic/DataLoader";
import Modal from "~/components/basic/Modal";
import Button from "~/components/basic/inputs/Button";

type ConfirmButtonProps = React.PropsWithChildren<{
    label: React.ReactNode;
    confirmLabel?: React.ReactNode;
    onClick: () => void | Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: UseMutationResult<any, any, any, any>;
}>;

export default function ConfirmButton({ label, confirmLabel, onClick, query, children }: ConfirmButtonProps) {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{label}</Button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
                {children}
                <div style={{ paddingTop: 32 }}>
                    {query?.isError && <p style={{ paddingBottom: 8 }}>{formatError(query.error)}</p>}
                    <Button
                        onClick={async () => {
                            await onClick();
                            setOpen(false);
                        }}
                        pending={query?.isLoading}
                    >
                        {confirmLabel ?? label}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
