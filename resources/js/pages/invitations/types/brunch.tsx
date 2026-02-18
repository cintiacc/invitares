import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationBrunch() {
    return (
        <>
            <Head title="Convite brunch" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#f0f7f2] via-[#f7f1e7] to-[#e9f2ff] text-[#1e1c17]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#5c6b61]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link
                                href="/convites"
                                method="post"
                                data={{
                                    type: 'brunch',
                                    title: 'Convite de brunch',
                                    redirect_to_edit: true,
                                }}
                            >
                                Criar convite
                            </Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#6f7f73]">
                                Convite brunch
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Um convite leve, com clima de manha e boa conversa.
                            </h1>
                            <p className="max-w-xl text-sm text-[#5a5f58] md:text-base">
                                Use este layout para organizar o menu, o local e
                                a experiencia que voce quer compartilhar.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#5c6b61]">
                                    Menu especial
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#5c6b61]">
                                    Confirmacao rapida
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#5c6b61]">
                                    Galeria
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#d4f1d9] via-[#f0e9d7] to-[#eef4ff] shadow-sm" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            'Boas vindas',
                            'Detalhes do brunch',
                            'Horário e local',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#596059]">
                                    Texto curto e objetivo para seus convidados.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Imagens e atmosfera
                                </h2>
                                <p className="text-sm text-[#596059]">
                                    Espaco moderno para fotos, menu e detalhes da
                                    experiencia.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#e0eadf] bg-[#f5faf6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e0eadf] bg-[#f5faf6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e0eadf] bg-[#f5faf6]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e0eadf] bg-[#f5faf6]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
