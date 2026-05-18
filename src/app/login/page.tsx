import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginDialogForm"
import { Button } from "@/components/ui/button"


const LoginPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Dialog defaultOpen>
                <DialogTrigger>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-transparent border text-black hover:bg-gray-300 transition-colors">
                    Login
                   </div>
                </DialogTrigger>
                <DialogContent className="rounded-2xl stroke-1 p-0 ring-0">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginPage
