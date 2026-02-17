import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationCorporativo() {
    return (
        <>
            <Head title="Convite corporativo" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#eef2f7] via-[#f3f4f6] to-[#e9f2ff] text-[#171a1f]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#4b5563]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link
                                href="/convites"
                                method="post"
                                data={{
                                    type: 'corporativo',
                                    title: 'Convite corporativo',
                                    redirect_to_edit: true,
                                }}
                            >
                                Criar convite
                            </Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#6b7280]">
                                Convite corporativo
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Estrutura clara para eventos profissionais.
                            </h1>
                            <p className="max-w-xl text-sm text-[#4b5563] md:text-base">
                                Agenda, speakers, local e confirmacao em um layout
                                moderno e direto.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#4b5563]">
                                    Programacao
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#4b5563]">
                                    Local
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#4b5563]">
                                    Credenciais
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#dbe7ff] via-[#eef2f7] to-[#f4f6f9] shadow-sm" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                                <div className="aspect-square rounded-2xl border border-white/70 bg-white/70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            'Mensagem de abertura',
                            'Pauta do evento',
                            'Confirme sua presenca',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#4b5563]">
                                    Texto rapido para orientar participantes.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Materiais e destaques
                                </h2>
                                <p className="text-sm text-[#4b5563]">
                                    Espaco para anexos, imagens e depoimentos.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#e5e7eb] bg-[#f8fafc]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e5e7eb] bg-[#f8fafc]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e5e7eb] bg-[#f8fafc]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#e5e7eb] bg-[#f8fafc]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
