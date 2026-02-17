import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationCha() {
    return (
        <>
            <Head title="Convite cha especial" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#fff1f4] via-[#fef6e8] to-[#f1f7ff] text-[#1f1a18]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#7c5f5a]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link
                                href="/convites"
                                method="post"
                                data={{
                                    type: 'cha',
                                    title: 'Convite de cha especial',
                                    redirect_to_edit: true,
                                }}
                            >
                                Criar convite
                            </Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#9b6f68]">
                                Convite cha especial
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Delicado e moderno para celebrar momentos unicos.
                            </h1>
                            <p className="max-w-xl text-sm text-[#5f4d48] md:text-base">
                                Personalize mensagens, lista de presentes e fotos
                                em uma pagina elegante e acolhedora.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#7c5f5a]">
                                    Lista especial
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#7c5f5a]">
                                    Mensagens
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#7c5f5a]">
                                    Confirmacao
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#ffd6df] via-[#ffe8cc] to-[#e8f0ff] shadow-sm" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            'Mensagem de boas vindas',
                            'Detalhes do cha',
                            'Horario e local',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#5f4d48]">
                                    Texto carinhoso e objetivo para os convidados.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Fotos e detalhes
                                </h2>
                                <p className="text-sm text-[#5f4d48]">
                                    Espaco para imagens, mapa e recados especiais.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#f2e1da] bg-[#fdf4f6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f2e1da] bg-[#fdf4f6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f2e1da] bg-[#fdf4f6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f2e1da] bg-[#fdf4f6]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
