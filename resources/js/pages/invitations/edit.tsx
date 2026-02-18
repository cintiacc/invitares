
import { useEffect, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { Eye, Mail, MessageCircle, Trash2, X } from 'lucide-react';

type Invitation = {
    id: number;
    type: string;
    title: string;
    subtitle: string | null;
    event_date: string | null;
    event_time: string | null;
    location: string | null;
    message: string | null;
    details: string | null;
    note: string | null;
    cover_image: string | null;
    gallery_images: string[] | null;
    gift_link: string | null;
    map_link: string | null;
    playlist_link: string | null;
    theme_color: string | null;
    font_color: string | null;
};

type Guest = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    invite_link: string | null;
    confirmed: boolean;
    confirmed_at: string | null;
};

type Gift = {
    id: number;
    name: string;
    link: string;
    image_link: string | null;
};

type EditInvitationProps = {
    invitation: Invitation;
    guests: Guest[];
    gifts: Gift[];
};

export default function EditInvitation({ invitation, guests, gifts }: EditInvitationProps) {
    const [activeTab, setActiveTab] = useState<'informacoes' | 'convidados' | 'presentes'>(
        'informacoes'
    );
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Editar convite', href: `/convites/${invitation.id}/editar` },
        ...(activeTab === 'convidados'
            ? [{ title: 'Convidados', href: `/convites/${invitation.id}/editar` }]
            : []),
    ];

    const { data, setData, post, processing, errors } = useForm({
        type: invitation.type ?? 'aniversario',
        title: invitation.title ?? '',
        subtitle: invitation.subtitle ?? '',
        event_date: invitation.event_date ?? '',
        event_time: invitation.event_time ?? '',
        location: invitation.location ?? '',
        message: invitation.message ?? '',
        details: invitation.details ?? '',
        note: invitation.note ?? '',
        gift_link: invitation.gift_link ?? '',
        map_link: invitation.map_link ?? '',
        playlist_link: invitation.playlist_link ?? '',
        theme_color: invitation.theme_color ?? '#7a159e',
        font_color: invitation.font_color ?? '#ffffff',
        cover_image: null as File | null,
        gallery_images: [] as File[],
        remove_cover_image: false,
        removed_gallery_images: [] as string[],
        _method: 'put',
    });
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [removeCoverImage, setRemoveCoverImage] = useState(false);
    const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        data: guestData,
        setData: setGuestData,
        post: postGuest,
        processing: guestProcessing,
        errors: guestErrors,
        reset: resetGuest,
    } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    const {
        data: guestImportData,
        setData: setGuestImportData,
        post: postGuestImport,
        processing: guestImporting,
        errors: guestImportErrors,
        reset: resetGuestImport,
    } = useForm({
        file: null as File | null,
    });

    const {
        data: giftData,
        setData: setGiftData,
        post: postGift,
        processing: giftProcessing,
        errors: giftErrors,
        reset: resetGift,
    } = useForm({
        name: '',
        link: '',
        image_link: '',
    });
    useEffect(() => {
        if (invitation.cover_image) {
            setCoverPreview(`/storage/${invitation.cover_image}`);
        } else {
            setCoverPreview(null);
        }
        if (invitation.gallery_images?.length) {
            setGalleryPreviews(
                invitation.gallery_images.map((image) => `/storage/${image}`)
            );
        } else {
            setGalleryPreviews([]);
        }
        setRemoveCoverImage(false);
        setRemovedGalleryImages([]);
    }, [invitation.cover_image, invitation.gallery_images]);

    useEffect(() => {
        setData('remove_cover_image', removeCoverImage);
    }, [removeCoverImage, setData]);

    useEffect(() => {
        setData('removed_gallery_images', removedGalleryImages);
    }, [removedGalleryImages, setData]);

    useEffect(() => {
        return () => {
            if (coverPreview && !coverPreview.startsWith('/storage/')) {
                URL.revokeObjectURL(coverPreview);
            }
            galleryPreviews.forEach((preview) => {
                if (!preview.startsWith('/storage/')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [coverPreview, galleryPreviews]);

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (coverPreview && !coverPreview.startsWith('/storage/')) {
            URL.revokeObjectURL(coverPreview);
        }
        setRemoveCoverImage(false);
        setData('cover_image', file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        galleryPreviews.forEach((preview) => {
            if (!preview.startsWith('/storage/')) {
                URL.revokeObjectURL(preview);
            }
        });
        setData('gallery_images', files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleRemoveCover = () => {
        if (!coverPreview) {
            return;
        }

        if (!coverPreview.startsWith('/storage/')) {
            URL.revokeObjectURL(coverPreview);
            setRemoveCoverImage(false);
        } else {
            setRemoveCoverImage(true);
        }

        setData('cover_image', null);
        setCoverPreview(null);
    };

    const handleRemoveGalleryPreview = (index: number, preview: string) => {
        setGalleryPreviews((current) =>
            current.filter((_, currentIndex) => currentIndex !== index)
        );

        if (!preview.startsWith('/storage/')) {
            URL.revokeObjectURL(preview);
            setData(
                'gallery_images',
                data.gallery_images.filter((_, currentIndex) => currentIndex !== index)
            );
            return;
        }

        const relativePath = preview.replace('/storage/', '');
        setRemovedGalleryImages((current) => {
            if (current.includes(relativePath)) {
                return current;
            }
            return [...current, relativePath];
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);
        post(`/convites/${invitation.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setRemoveCoverImage(false);
                setRemovedGalleryImages([]);
            },
            onError: () => {
                setSubmitError(
                    'Nao foi possivel salvar. Verifique os campos obrigatorios e tente novamente.'
                );
            },
        });
    };

    const handleGuestSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        postGuest(`/convites/${invitation.id}/guests`, {
            onSuccess: () => {
                resetGuest();
                router.reload({ only: ['guests'] });
            },
        });
    };

    const handleGuestImport = (event: React.FormEvent) => {
        event.preventDefault();
        postGuestImport(`/convites/${invitation.id}/guests/import`, {
            forceFormData: true,
            onSuccess: () => {
                resetGuestImport();
                router.reload({ only: ['guests'] });
            },
        });
    };

    const handleGuestDelete = (guestId: number) => {
        router.delete(`/convites/${invitation.id}/guests/${guestId}`, {
            onSuccess: () => {
                router.reload({ only: ['guests'] });
            },
        });
    };

    const copyInviteLink = async (inviteLink: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(inviteLink);
            }
        } catch (error) {
            console.error('Nao foi possivel copiar o link do convite.', error);
        }
    };

    const buildInviteMessage = (guest: Guest) => {
        const eventTitle = invitation.title || 'nosso evento';
        return `Ola ${guest.name}! Voce foi convidado(a) para ${eventTitle}. Acesse seu convite: ${guest.invite_link}`;
    };

    const handleSendInviteWhatsapp = async (guest: Guest) => {
        if (!guest.invite_link) {
            return;
        }

        await copyInviteLink(guest.invite_link);
        const phone = (guest.phone ?? '').replace(/\D/g, '');
        const text = encodeURIComponent(buildInviteMessage(guest));
        const whatsappUrl = phone
            ? `https://wa.me/${phone}?text=${text}`
            : `https://wa.me/?text=${text}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const handleSendInviteEmail = async (guest: Guest) => {
        if (!guest.invite_link) {
            return;
        }

        await copyInviteLink(guest.invite_link);
        const subject = encodeURIComponent(`Convite: ${invitation.title || 'Evento'}`);
        const body = encodeURIComponent(buildInviteMessage(guest));
        const recipient = guest.email ?? '';

        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    };

    const handleGiftSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        postGift(`/convites/${invitation.id}/gifts`, {
            onSuccess: () => {
                resetGift();
                router.reload({ only: ['gifts'] });
            },
        });
    };

    const handleGiftDelete = (giftId: number) => {
        router.delete(`/convites/${invitation.id}/gifts/${giftId}`, {
            onSuccess: () => {
                router.reload({ only: ['gifts'] });
            },
        });
    };

    const tabs = [
        { key: 'informacoes' as const, label: 'Informações' },
        { key: 'convidados' as const, label: 'Convidados' },
        { key: 'presentes' as const, label: 'Presentes' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar convite" />
            <div className="px-6 pt-6">
                <div
                    role="tablist"
                    aria-label="Abas de edicao do convite"
                    className="inline-flex w-full max-w-xl rounded-xl border bg-muted/30 p-1"
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                id={`tab-${tab.key}`}
                                aria-selected={isActive}
                                aria-controls={`panel-${tab.key}`}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeTab === 'informacoes' && (
                <form
                    className="flex flex-col gap-8 p-6"
                    onSubmit={handleSubmit}
                    role="tabpanel"
                    id="panel-informacoes"
                    aria-labelledby="tab-informacoes"
                >
                    {submitError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {submitError}
                        </div>
                    )}
                    <section className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold">Editar Convite</h1>
                    </section>

                    <section className="grid gap-6 rounded-2xl border bg-background p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="min-w-0 space-y-4">
                            <div>
                                <label className="text-sm font-medium">Tipo</label>
                                <select
                                    className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                    value={data.type}
                                    onChange={(event) =>
                                        setData('type', event.target.value)
                                    }
                                >
                                    <option value="aniversario">Aniversario</option>
                                    <option value="brunch">Brunch</option>
                                    <option value="casamento">Casamento</option>
                                    <option value="corporativo">Corporativo</option>
                                    <option value="cha">Cha especial</option>
                                    <option value="outro">Outro</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.type}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium">Titulo</label>
                                <Input
                                    placeholder="Ex: Festa de aniversario da Julia"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium">Subtitulo</label>
                                <Input
                                    placeholder="Ex: Vamos celebrar juntos"
                                    value={data.subtitle}
                                    onChange={(event) =>
                                        setData('subtitle', event.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Data</label>
                                    <Input
                                        type="date"
                                        value={data.event_date}
                                        onChange={(event) =>
                                            setData('event_date', event.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Horário</label>
                                    <Input
                                        type="time"
                                        value={data.event_time}
                                        onChange={(event) =>
                                            setData('event_time', event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Local</label>
                                <Input
                                    placeholder="Endereco completo do evento"
                                    value={data.location}
                                    onChange={(event) =>
                                        setData('location', event.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Mensagem principal
                                </label>
                                <textarea
                                    className="h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                    placeholder="Conte a historia ou o clima do evento"
                                    value={data.message}
                                    onChange={(event) =>
                                        setData('message', event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="min-w-0 space-y-4">
                            <div className="rounded-2xl border bg-muted/30 p-4">
                                <label className="text-sm font-medium">
                                    Imagem de capa
                                </label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 w-full min-w-0"
                                    onChange={handleCoverChange}
                                />
                                <div className="relative mt-4 w-full max-w-full overflow-hidden rounded-xl border bg-background">
                                    {coverPreview ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCover}
                                                className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                                title="Remover imagem de capa"
                                                aria-label="Remover imagem de capa"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <img
                                                src={coverPreview}
                                                alt="Pre-visualizacao da capa"
                                                className="block h-40 w-full max-w-full object-cover sm:h-48"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                                            Pre-visualizacao da capa
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-muted/30 p-4">
                                <label className="text-sm font-medium">
                                    Galeria de imagens
                                </label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="mt-2 w-full min-w-0"
                                    onChange={handleGalleryChange}
                                />
                                <div className="mt-4 w-full max-w-full min-w-0">
                                    {galleryPreviews.length === 0 && (
                                        <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                            Adicione imagens para preencher a galeria.
                                        </div>
                                    )}
                                    {galleryPreviews.length > 0 && (
                                        <div className="flex w-full max-w-full min-w-0 items-center gap-2 overflow-x-auto rounded-xl border bg-background p-2">
                                            {galleryPreviews.map((preview, index) => (
                                                <div
                                                    key={preview}
                                                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted/20 sm:h-16 sm:w-16"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveGalleryPreview(index, preview)}
                                                        className="absolute right-1 top-1 z-10 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                                                        title="Remover imagem da galeria"
                                                        aria-label="Remover imagem da galeria"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                    <img
                                                        src={preview}
                                                        alt="Pre-visualizacao da galeria"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-2xl border bg-background p-6 shadow-sm lg:grid-cols-2">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">
                                Detalhes do evento
                            </label>
                            <textarea
                                className="h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                placeholder="Explique como chegar, traje, lista de confirmacao"
                                value={data.details}
                                onChange={(event) =>
                                    setData('details', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium">
                                Mensagem para convidados
                            </label>
                            <textarea
                                className="h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                placeholder="Deixe uma mensagem carinhosa"
                                value={data.note}
                                onChange={(event) =>
                                    setData('note', event.target.value)
                                }
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 rounded-2xl border bg-background p-6 shadow-sm">
                        <label className="text-sm font-medium">
                            Links externos (opcional)
                        </label>
                        <Input
                            placeholder="Lista de presentes"
                            value={data.gift_link}
                            onChange={(event) =>
                                setData('gift_link', event.target.value)
                            }
                        />
                        <Input
                            placeholder="Mapa ou localizacao"
                            value={data.map_link}
                            onChange={(event) =>
                                setData('map_link', event.target.value)
                            }
                        />
                        <Input
                            placeholder="Playlist do evento"
                            value={data.playlist_link}
                            onChange={(event) =>
                                setData('playlist_link', event.target.value)
                            }
                        />
                    </section>

                    <section className="flex flex-col gap-3 rounded-2xl border bg-background p-6 shadow-sm">
                        <label className="text-sm font-medium">
                            Cor do convite
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <input
                                type="color"
                                value={data.theme_color}
                                onChange={(event) =>
                                    setData('theme_color', event.target.value)
                                }
                                className="h-12 w-12 cursor-pointer rounded-full border border-input bg-transparent p-1"
                                aria-label="Escolher cor do convite"
                            />
                            <Input
                                placeholder="#7a159e"
                                value={data.theme_color}
                                onChange={(event) =>
                                    setData('theme_color', event.target.value)
                                }
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 rounded-2xl border bg-background p-6 shadow-sm">
                        <label className="text-sm font-medium">Cor da fonte</label>
                        <div className="flex flex-wrap items-center gap-4">
                            <input
                                type="color"
                                value={data.font_color}
                                onChange={(event) =>
                                    setData('font_color', event.target.value)
                                }
                                className="h-12 w-12 cursor-pointer rounded-full border border-input bg-transparent p-1"
                                aria-label="Escolher cor da fonte"
                            />
                            <Input
                                placeholder="#ffffff"
                                value={data.font_color}
                                onChange={(event) =>
                                    setData('font_color', event.target.value)
                                }
                            />
                        </div>
                    </section>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={processing}>
                            Salvar
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={`/convites/${invitation.id}/preview`}>Preview</Link>
                        </Button>
                    </div>
                </form>
            )}
            {activeTab === 'convidados' && (
                <div
                    className="flex flex-col gap-8 p-6"
                    role="tabpanel"
                    id="panel-convidados"
                    aria-labelledby="tab-convidados"
                >
                    <section className="rounded-2xl border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Cadastrar convidado</h2>
                        <form
                            className="mt-4 grid gap-4 md:grid-cols-3"
                            onSubmit={handleGuestSubmit}
                        >
                            <div>
                                <Input
                                    placeholder="Nome"
                                    value={guestData.name}
                                    onChange={(event) =>
                                        setGuestData('name', event.target.value)
                                    }
                                />
                                {guestErrors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {guestErrors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Email"
                                    value={guestData.email}
                                    onChange={(event) =>
                                        setGuestData('email', event.target.value)
                                    }
                                />
                                {guestErrors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {guestErrors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Telefone"
                                    value={guestData.phone}
                                    onChange={(event) =>
                                        setGuestData('phone', event.target.value)
                                    }
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <Button type="submit" disabled={guestProcessing}>
                                    Salvar convidado
                                </Button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-2xl border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Importar CSV</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Use colunas: nome, email, telefone.
                        </p>
                        <form
                            className="mt-4 flex flex-wrap items-center gap-4"
                            onSubmit={handleGuestImport}
                        >
                            <Input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(event) =>
                                    setGuestImportData(
                                        'file',
                                        event.target.files?.[0] ?? null
                                    )
                                }
                            />
                            {guestImportErrors.file && (
                                <p className="text-sm text-red-500">
                                    {guestImportErrors.file}
                                </p>
                            )}
                            <Button type="submit" disabled={guestImporting}>
                                Importar
                            </Button>
                        </form>
                    </section>

                    <section className="rounded-2xl border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Convidados</h2>
                        {guests.length === 0 && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Nenhum convidado cadastrado.
                            </p>
                        )}
                        {guests.length > 0 && (
                            <div className="mt-4 rounded-xl border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Telefone</TableHead>
                                            <TableHead className="text-right">Acoes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guests.map((guest) => (
                                            <TableRow key={guest.id}>
                                                <TableCell className="font-medium">{guest.name}</TableCell>
                                                <TableCell>{guest.email}</TableCell>
                                                <TableCell>{guest.phone || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon-sm"
                                                            title="Visualizar convite"
                                                            disabled={!guest.invite_link}
                                                            onClick={() => {
                                                                if (guest.invite_link) {
                                                                    window.open(
                                                                        guest.invite_link,
                                                                        '_blank',
                                                                        'noopener,noreferrer'
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon-sm"
                                                            onClick={() => handleSendInviteWhatsapp(guest)}
                                                            disabled={!guest.invite_link}
                                                            title="Enviar convite por WhatsApp"
                                                            aria-label="Enviar convite por WhatsApp"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon-sm"
                                                            onClick={() => handleSendInviteEmail(guest)}
                                                            disabled={!guest.invite_link}
                                                            title="Enviar convite por email"
                                                            aria-label="Enviar convite por email"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon-sm"
                                                            onClick={() => handleGuestDelete(guest.id)}
                                                            title="Remover convidado"
                                                            aria-label="Remover convidado"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'presentes' && (
                <div
                    className="flex flex-col gap-8 p-6"
                    role="tabpanel"
                    id="panel-presentes"
                    aria-labelledby="tab-presentes"
                >
                    <section className="rounded-2xl border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Cadastrar presente</h2>
                        <form
                            className="mt-4 grid gap-4 md:grid-cols-3"
                            onSubmit={handleGiftSubmit}
                        >
                            <div>
                                <Input
                                    placeholder="Titulo"
                                    value={giftData.name}
                                    onChange={(event) =>
                                        setGiftData('name', event.target.value)
                                    }
                                />
                                {giftErrors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {giftErrors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Link"
                                    value={giftData.link}
                                    onChange={(event) =>
                                        setGiftData('link', event.target.value)
                                    }
                                />
                                {giftErrors.link && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {giftErrors.link}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Imagem (opcional)"
                                    value={giftData.image_link}
                                    onChange={(event) =>
                                        setGiftData('image_link', event.target.value)
                                    }
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <Button type="submit" disabled={giftProcessing}>
                                    Salvar presente
                                </Button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-2xl border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Presentes sugeridos</h2>
                        {gifts.length === 0 && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Nenhum presente cadastrado.
                            </p>
                        )}
                        {gifts.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {gifts.map((gift) => (
                                    <div
                                        key={gift.id}
                                        className="flex flex-col gap-2 rounded-xl border bg-white p-4 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <p className="font-medium">{gift.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {gift.link}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <a
                                                    href={gift.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Abrir
                                                </a>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleGiftDelete(gift.id)}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </AppLayout>
    );
}
