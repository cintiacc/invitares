import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationOutro() {
    return (
        <>
            <Head title="Convite personalizado" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#f3f1ff] via-[#f6f9f1] to-[#fff4f0] text-[#1f1b1a]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#6b6378]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link href="/convites/editar">Editar convite</Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#7b6f8d]">
                                Convite personalizado
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Um convite flexivel para qualquer tipo de evento.
                            </h1>
                            <p className="max-w-xl text-sm text-[#5a5564] md:text-base">
                                Combine textos, imagens e secoes do jeito que voce
                                quiser para criar uma experiencia unica.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b6378]">
                                    Layout livre
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b6378]">
                                    Blocos modulares
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b6378]">
                                    Destaques
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#ddd3ff] via-[#f0f4d8] to-[#ffe5d8] shadow-sm" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            'Titulo principal',
                            'Detalhes essenciais',
                            'Convite para acao',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#5a5564]">
                                    Blocos adaptaveis para seu tipo de evento.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Imagens e textos
                                </h2>
                                <p className="text-sm text-[#5a5564]">
                                    Espaco para galerias, textos longos e depoimentos.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#ece8f4] bg-[#f6f4fb]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#ece8f4] bg-[#f6f4fb]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#ece8f4] bg-[#f6f4fb]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#ece8f4] bg-[#f6f4fb]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
