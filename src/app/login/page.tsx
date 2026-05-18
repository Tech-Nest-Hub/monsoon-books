import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { LoginForm } from "./LoginDialogForm"
import { createClient } from "@/utils/supabase/client"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

const LoginPage = async () => {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If logged in, redirect away
    if (user) {
        const dbUser = await prisma.user.findUnique({
            where: { authId: user.id },
        })

        if (dbUser) {
            redirect("/") // change this to your dashboard route if needed
        }
    }

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