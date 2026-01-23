import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Editar convite', href: '/convites/editar' },
];

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
};

export default function EditInvitation({ invitation }: { invitation: Invitation }) {
    const { data, setData, put, processing, errors } = useForm({
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
        cover_image: null as File | null,
        gallery_images: [] as File[],
    });
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (invitation.cover_image) {
            setCoverPreview(`/storage/${invitation.cover_image}`);
        }
        if (invitation.gallery_images?.length) {
            setGalleryPreviews(
                invitation.gallery_images.map((image) => `/storage/${image}`)
            );
        }
    }, [invitation.cover_image, invitation.gallery_images]);

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (coverPreview && !coverPreview.startsWith('/storage/')) {
            URL.revokeObjectURL(coverPreview);
        }
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/convites/${invitation.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar convite" />
            <form className="flex flex-col gap-8 p-6" onSubmit={handleSubmit}>
                <section className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">
                        Area de edicao do convite
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ajuste textos, imagens e informacoes principais do evento.
                    </p>
                </section>

                <section className="grid gap-6 rounded-2xl border bg-background p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Tipo</label>
                            <select
                                className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                value={data.type}
                                onChange={(event) => setData('type', event.target.value)}
                            >
                                <option value="aniversario">Aniversario</option>
                                <option value="brunch">Brunch</option>
                                <option value="casamento">Casamento</option>
                                <option value="corporativo">Corporativo</option>
                                <option value="cha">Cha especial</option>
                                <option value="outro">Outro</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Titulo</label>
                            <Input
                                placeholder="Ex: Festa de aniversario da Julia"
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Subtitulo</label>
                            <Input
                                placeholder="Ex: Vamos celebrar juntos"
                                value={data.subtitle}
                                onChange={(event) => setData('subtitle', event.target.value)}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium">Data</label>
                                <Input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(event) => setData('event_date', event.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Horario</label>
                                <Input
                                    type="time"
                                    value={data.event_time}
                                    onChange={(event) => setData('event_time', event.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Local</label>
                            <Input
                                placeholder="Endereco completo do evento"
                                value={data.location}
                                onChange={(event) => setData('location', event.target.value)}
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
                                onChange={(event) => setData('message', event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <label className="text-sm font-medium">
                                Imagem de capa
                            </label>
                            <Input
                                type="file"
                                accept="image/*"
                                className="mt-2"
                                onChange={handleCoverChange}
                            />
                            <div className="mt-4 overflow-hidden rounded-xl border bg-background">
                                {coverPreview ? (
                                    <img
                                        src={coverPreview}
                                        alt="Pre-visualizacao da capa"
                                        className="h-48 w-full object-cover"
                                    />
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
                                className="mt-2"
                                onChange={handleGalleryChange}
                            />
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {galleryPreviews.length === 0 && (
                                    <div className="col-span-2 rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                        Adicione imagens para preencher a galeria.
                                    </div>
                                )}
                                {galleryPreviews.map((preview) => (
                                    <div
                                        key={preview}
                                        className="aspect-[4/3] overflow-hidden rounded-xl border bg-background"
                                    >
                                        <img
                                            src={preview}
                                            alt="Pre-visualizacao da galeria"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
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
                            onChange={(event) => setData('details', event.target.value)}
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
                            onChange={(event) => setData('note', event.target.value)}
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
                        onChange={(event) => setData('gift_link', event.target.value)}
                    />
                    <Input
                        placeholder="Mapa ou localizacao"
                        value={data.map_link}
                        onChange={(event) => setData('map_link', event.target.value)}
                    />
                    <Input
                        placeholder="Playlist do evento"
                        value={data.playlist_link}
                        onChange={(event) => setData('playlist_link', event.target.value)}
                    />
                </section>

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={processing}>
                        Salvar alteracoes
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={dashboard()}>Voltar ao dashboard</Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
