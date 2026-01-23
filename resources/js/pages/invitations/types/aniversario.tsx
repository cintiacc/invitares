import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export default function InvitationAniversario() {
    return (
        <>
            <Head title="Convite aniversario" />
            <div className="min-h-[100dvh] bg-gradient-to-br from-[#fff1e1] via-[#f6f4ff] to-[#e7f6ff] text-[#1f1b16]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/convites/novo"
                            className="text-sm font-medium text-[#6d5b4b]"
                        >
                            &larr; Voltar aos tipos
                        </Link>
                        <Button asChild>
                            <Link href="/convites/editar">Editar convite</Link>
                        </Button>
                    </header>

                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#8a6a4f]">
                                Convite aniversario
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Uma pagina vibrante para celebrar com quem voce ama.
                            </h1>
                            <p className="max-w-xl text-sm text-[#5f5147] md:text-base">
                                Espaco pronto para historia do evento, fotos, lista
                                de presentes e confirmacao. Personalize cores e
                                detalhes quando quiser.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6d5b4b]">
                                    Lista de convidados
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6d5b4b]">
                                    Presentes
                                </span>
                                <span className="rounded-full bg-white/70 px-3 py-1 text-[#6d5b4b]">
                                    Confirmacao
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="aspect-[4/3] rounded-3xl border border-white/70 bg-gradient-to-br from-[#fbd7b3] via-[#f9e6cf] to-[#fff4ea] shadow-sm" />
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
                            'Detalhes da festa',
                            'Endereco e horario',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                            >
                                <p className="text-sm font-semibold">{item}</p>
                                <p className="mt-2 text-sm text-[#6a5a4d]">
                                    Texto curto para orientar seus convidados.
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">
                                    Galeria e conteudo
                                </h2>
                                <p className="text-sm text-[#6a5a4d]">
                                    Area dedicada para fotos, videos e textos
                                    que contem a historia do aniversariante.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="aspect-[4/3] rounded-2xl border border-[#f0e5d8] bg-[#fbf7f2]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f0e5d8] bg-[#fbf7f2]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f0e5d8] bg-[#fbf7f2]" />
                                <div className="aspect-[4/3] rounded-2xl border border-[#f0e5d8] bg-[#fbf7f2]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
