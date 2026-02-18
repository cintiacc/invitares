import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Settings } from 'lucide-react';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const firstName = auth.user.name?.trim().split(' ')[0] ?? '';
    const initials = getInitials(auth.user.name);

    const handleLogout = () => {
        router.flushAll();
    };

    return (
        <>
            <header className="border-b bg-background">
                <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href={dashboard()} prefetch className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2622] text-sm font-semibold text-white">
                            {initials}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                Invitares
                            </span>
                            <span className="text-sm font-semibold">
                                Seja bem-vindo{firstName ? `, ${firstName}` : ''}
                            </span>
                        </div>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                    {initials}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    className="block w-full"
                                    href={edit()}
                                    as="button"
                                    prefetch
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    className="block w-full"
                                    href={logout()}
                                    as="button"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {breadcrumbs.length > 1 && (
                <div className="border-b">
                    <div className="mx-auto flex h-10 w-full max-w-screen-2xl items-center px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
                        {breadcrumbs.map((item, index) => (
                            <span key={item.href} className="inline-flex items-center">
                                {index > 0 && <span className="mx-2">/</span>}
                                {item.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
