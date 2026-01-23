import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationCasamento() {
    return (
        <>
            <Head title="Convite casamento" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#f7f3f0] via-[#f7f1ff] to-[#f3f8f6] text-[#1e1a18]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#6b5f55]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link href="/convites/editar">Editar convite</Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#8c7b72]">
                                Convite casamento
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Elegante, romantico e pronto para o grande dia.
                            </h1>
                            <p className="max-w-xl text-sm text-[#5f5148] md:text-base">
                                Area para historia do casal, cerimonia, recepcao
                                e lista de presentes em um visual sofisticado.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b5f55]">
                                    Cerimonia
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b5f55]">
                                    Recepcao
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6b5f55]">
                                    Presentes
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#f7e2db] via-[#f2ebe7] to-[#f8f3ff] shadow-sm" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            'Nossa historia',
                            'Detalhes da cerimonia',
                            'Confirme sua presenca',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#5f5148]">
                                    Texto moderno e elegante para seus convidados.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Imagens e mensagens
                                </h2>
                                <p className="text-sm text-[#5f5148]">
                                    Espaco para fotos do casal, mapa do local e
                                    recados especiais.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#efe3db] bg-[#fbf7f3]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#efe3db] bg-[#fbf7f3]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#efe3db] bg-[#fbf7f3]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#efe3db] bg-[#fbf7f3]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
