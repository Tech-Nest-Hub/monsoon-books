import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginDialogForm"

const LoginPage = () => {
    return (
        <div>
            <Dialog>
                <DialogTrigger>Login</DialogTrigger>
                <DialogContent className="rounded-2xl stroke-1 p-0 ring-0">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginPage
