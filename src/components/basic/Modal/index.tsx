type DialogProps = React.DialogHTMLAttributes<HTMLDialogElement>;
type ModalProps = DialogProps &
    Required<Pick<DialogProps, "onClose">> & {
        isOpen: boolean;
    };
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import Icons from "../Icons";
import Button from "../inputs/Button";
import styles from "./modal.module.css";

export default function Modal({ children, className, isOpen, ...props }: ModalProps) {
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    }, [isOpen]);

    const onClickOut = useCallback(({ target }: React.MouseEvent) => {
        if (target === dialog.current) {
            dialog.current?.close();
        }
    }, []);

    return (
        <dialog ref={dialog} className={clsx(styles.modal, className)} onClick={onClickOut} {...props}>
            <div className={styles.wrapper}>{children}</div>
            <form className={styles.close}>
                <Button formMethod="dialog" type="submit">
                    <Icons.Close width={18} height={18} />
                </Button>
            </form>
        </dialog>
    );
}
