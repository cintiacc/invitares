import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/avatar.png" alt="Avatar" />
                    <AvatarFallback>CC</AvatarFallback>
                </Avatar>

                {/* Texto */}
                <div className="grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">
                    Seja bem-vindo(a)
                    </span>
                </div>
                </div>

        </>
    );
}
