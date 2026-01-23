import { Head, Link, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

type InviteType = {
    id: string;
    title: string;
    description: string;
    href: string;
};

const inviteTypes: InviteType[] = [
    {
        id: 'aniversário',
        title: 'Aniversário',
        description: 'Festas, jantares e datas especiais com sua galera.',
        href: '/convites/tipo/aniversario',
    },
    {
        id: 'brunch',
        title: 'Brunch',
        description: 'Encontros leves, cafe estendido e clima relax.',
        href: '/convites/tipo/brunch',
    },
    {
        id: 'casamento',
        title: 'Casamento',
        description: 'Cerimonia, recepcao e lista de presentes completa.',
        href: '/convites/tipo/casamento',
    },
    {
        id: 'corporativo',
        title: 'Corporativo',
        description: 'Workshops, confraternizacoes e eventos de equipe.',
        href: '/convites/tipo/corporativo',
    },
    {
        id: 'cha',
        title: 'Cha especial',
        description: 'Cha de bebe, cha de cozinha e outras celebracoes.',
        href: '/convites/tipo/cha',
    },
    {
        id: 'outro',
        title: 'Outro tipo',
        description: 'Crie do seu jeito com tudo no mesmo lugar.',
        href: '/convites/tipo/outro',
    },
];

export default function CreateInvitation() {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = Boolean(auth && auth.user);

    return (
        <>
            <Head title="Novo convite" />
            <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#f6efe7] text-[#1c1917]">
                <div className="pointer-events-none absolute -top-16 right-10 h-64 w-64 rounded-full bg-[#ffd2a1] opacity-70 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-[-2rem] h-72 w-72 rounded-full bg-[#bfe4ff] opacity-70 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-40 h-32 w-32 -translate-x-1/2 rounded-full bg-[#f7b7b2] opacity-60 blur-3xl" />

                <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link href={dashboard()}>
                                &larr; Voltar ao dashboard
                            </Link>
                        </Button>
                    </div>
                    <header className="space-y-4">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-[#7c6b5f]">
                            Novo convite
                        </span>
                        <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                            Convites para qualquer ocasião, do seu jeito.
                        </h1>
                        <p className="max-w-2xl text-sm text-[#5f554c] md:text-base">
                            Escolha o tipo de convite e gere a pagina automaticamente.
                            Cada evento guarda a propria logica de convidados confirmados
                            e presentes.
                        </p>
                    </header>

                    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {inviteTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={type.href}
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#dfd4ca] bg-white px-5 py-6 text-left text-[#1c1917] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">
                                        {type.title}
                                    </h2>
                                    <p className="text-sm text-[#6a5f55]">
                                        {type.description}
                                    </p>
                                </div>
                                <span className="mt-6 inline-flex w-fit items-center rounded-full bg-[#f3ebe2] px-3 py-1 text-xs font-medium text-[#5b524a]">
                                    Criar agora
                                </span>
                            </Link>
                        ))}
                    </section>

                    <section className="flex flex-col gap-4 rounded-2xl border border-[#dfd4ca] bg-white/80 p-6 shadow-sm backdrop-blur">
                        <p className="text-sm text-[#5f554c]">
                            Cada escolha abre uma pagina moderna pronta para receber
                            textos, imagens e detalhes do evento.
                        </p>

                        {isAuthenticated ? (
                            <Button asChild className="w-full md:w-auto">
                                <Link href={dashboard()}>Voltar ao dashboard</Link>
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-3 md:flex-row">
                                <Button asChild className="w-full md:w-auto">
                                    <Link href={register()}>
                                        Criar conta para continuar
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full md:w-auto"
                                >
                                    <Link href={login()}>
                                        Ja tenho conta
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
