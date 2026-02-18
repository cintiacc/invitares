<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class InvitationController extends Controller
{
    public function store(Request $request)
    {
        if ($request->filled('event_time')) {
            $eventTime = trim((string) $request->input('event_time'));
            if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $eventTime)) {
                $request->merge(['event_time' => substr($eventTime, 0, 5)]);
            }
        }

        $data = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'event_date' => 'nullable|date',
            'event_time' => 'nullable|date_format:H:i',
            'location' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'details' => 'nullable|string',
            'note' => 'nullable|string',
            'gift_link' => 'nullable|string|max:255',
            'map_link' => 'nullable|string|max:255',
            'playlist_link' => 'nullable|string|max:255',
            'theme_color' => 'nullable|string|max:20',
            'cover_image' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
        ]);

        $themeColor = $data['theme_color'] ?? null;
        if (is_string($themeColor)) {
            $themeColor = trim($themeColor);
            if ($themeColor !== '' && $themeColor[0] !== '#') {
                $themeColor = '#'.$themeColor;
            }
            if ($themeColor !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $themeColor)) {
                $themeColor = null;
            }
        }

        $fontColor = $data['font_color'] ?? null;
        if (is_string($fontColor)) {
            $fontColor = trim($fontColor);
            if ($fontColor !== '' && $fontColor[0] !== '#') {
                $fontColor = '#'.$fontColor;
            }
            if ($fontColor !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $fontColor)) {
                $fontColor = null;
            }
        }

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('invitations/covers', 'public');
        }

        $galleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                if (!$file) {
                    continue;
                }
                $galleryPaths[] = $file->store('invitations/gallery', 'public');
            }
        }

        $invitation = Invitation::create([
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'event_date' => $data['event_date'] ?? null,
            'event_time' => $data['event_time'] ?? null,
            'location' => $data['location'] ?? null,
            'message' => $data['message'] ?? null,
            'details' => $data['details'] ?? null,
            'note' => $data['note'] ?? null,
            'cover_image' => $coverPath,
            'gallery_images' => $galleryPaths,
            'gift_link' => $data['gift_link'] ?? null,
            'map_link' => $data['map_link'] ?? null,
            'playlist_link' => $data['playlist_link'] ?? null,
            'theme_color' => $themeColor ?? '#7a159e',
            'font_color' => $fontColor ?? '#ffffff',
        ]);

        if ($request->boolean('redirect_to_edit')) {
            return redirect()->route('invitations.edit', $invitation);
        }

        return redirect()->route('invitations.preview', $invitation);
    }

    public function preview(Invitation $invitation)
    {
        if ($invitation->user_id !== request()->user()->id) {
            abort(403);
        }

        return inertia('invitations/preview', [
            'invitation' => $invitation,
        ]);
    }

    public function edit(Invitation $invitation)
    {
        if ($invitation->user_id !== request()->user()->id) {
            abort(403);
        }

        return inertia('invitations/edit', [
            'invitation' => $invitation,
            'guests' => $invitation->guests()->latest()->get(),
            'gifts' => $invitation->gifts()->latest()->get(),
        ]);
    }

    public function update(Request $request, Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($request->filled('event_time')) {
            $eventTime = trim((string) $request->input('event_time'));
            if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $eventTime)) {
                $request->merge(['event_time' => substr($eventTime, 0, 5)]);
            }
        }

        Log::info('Invitation update request received.', [
            'invitation_id' => $invitation->id,
            'user_id' => $request->user()->id,
            'theme_color_input' => $request->input('theme_color'),
            'has_theme_color' => $request->has('theme_color'),
            'content_type' => $request->header('content-type'),
        ]);

        try {
            $data = $request->validate([
                'type' => 'required|string|max:50',
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'event_date' => 'nullable|date',
                'event_time' => 'nullable|date_format:H:i',
                'location' => 'nullable|string|max:255',
                'message' => 'nullable|string',
                'details' => 'nullable|string',
                'note' => 'nullable|string',
                'gift_link' => 'nullable|string|max:255',
                'map_link' => 'nullable|string|max:255',
                'playlist_link' => 'nullable|string|max:255',
                'theme_color' => 'nullable|string|max:20',
                'font_color' => 'nullable|string|max:20',
                'cover_image' => 'nullable|image|max:2048',
                'gallery_images.*' => 'nullable|image|max:2048',
                'remove_cover_image' => 'nullable|boolean',
                'removed_gallery_images' => 'nullable|array',
                'removed_gallery_images.*' => 'string',
            ]);
        } catch (ValidationException $exception) {
            Log::warning('Invitation update validation failed.', [
                'invitation_id' => $invitation->id,
                'errors' => $exception->errors(),
            ]);

            throw $exception;
        }
        $type = $data['type'];
        $title = $data['title'];

        Log::info('Invitation update validated payload.', [
            'invitation_id' => $invitation->id,
            'theme_color' => $data['theme_color'] ?? null,
            'type' => $type,
            'title' => $title,
        ]);

        $themeColor = $data['theme_color'] ?? null;
        if (is_string($themeColor)) {
            $themeColor = trim($themeColor);
            if ($themeColor !== '' && $themeColor[0] !== '#') {
                $themeColor = '#'.$themeColor;
            }
            if ($themeColor !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $themeColor)) {
                $themeColor = null;
            }
        }

        $fontColor = $data['font_color'] ?? null;
        if (is_string($fontColor)) {
            $fontColor = trim($fontColor);
            if ($fontColor !== '' && $fontColor[0] !== '#') {
                $fontColor = '#'.$fontColor;
            }
            if ($fontColor !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $fontColor)) {
                $fontColor = null;
            }
        }

        $deletePublicPath = function (?string $path) use ($invitation) {
            if (!$path) {
                return;
            }

            try {
                $deleted = Storage::disk('public')->delete($path);
                if (!$deleted) {
                    Log::warning('Failed to delete invitation media file from storage.', [
                        'invitation_id' => $invitation->id,
                        'path' => $path,
                    ]);
                }
            } catch (\Throwable $exception) {
                Log::warning('Exception while deleting invitation media file from storage.', [
                    'invitation_id' => $invitation->id,
                    'path' => $path,
                    'error' => $exception->getMessage(),
                ]);
            }
        };

        $currentCoverPath = $invitation->cover_image;
        $removeCoverImage = $request->boolean('remove_cover_image');
        $coverPath = $removeCoverImage ? null : $currentCoverPath;

        if ($removeCoverImage && $currentCoverPath) {
            $deletePublicPath($currentCoverPath);
        }

        if ($request->hasFile('cover_image')) {
            if (!$removeCoverImage && $currentCoverPath) {
                $deletePublicPath($currentCoverPath);
            }
            $coverPath = $request->file('cover_image')->store('invitations/covers', 'public');
        }

        $currentGalleryPaths = $invitation->gallery_images ?? [];
        $allowedGalleryPaths = array_flip($currentGalleryPaths);
        $removedGalleryImages = array_values(array_filter(
            $data['removed_gallery_images'] ?? [],
            fn ($path) => isset($allowedGalleryPaths[$path])
        ));

        $galleryPaths = array_values(array_filter(
            $currentGalleryPaths,
            fn ($path) => !in_array($path, $removedGalleryImages, true)
        ));

        foreach ($removedGalleryImages as $removedPath) {
            $deletePublicPath($removedPath);
        }

        if ($request->hasFile('gallery_images')) {
            // Keep current semantics: uploading gallery files replaces previous gallery set.
            foreach ($galleryPaths as $existingPath) {
                $deletePublicPath($existingPath);
            }
            $galleryPaths = [];
            foreach ($request->file('gallery_images') as $file) {
                if (!$file) {
                    continue;
                }
                $galleryPaths[] = $file->store('invitations/gallery', 'public');
            }
        }

        $invitation->update([
            'type' => $type,
            'title' => $title,
            'subtitle' => $data['subtitle'] ?? null,
            'event_date' => $data['event_date'] ?? null,
            'event_time' => $data['event_time'] ?? null,
            'location' => $data['location'] ?? null,
            'message' => $data['message'] ?? null,
            'details' => $data['details'] ?? null,
            'note' => $data['note'] ?? null,
            'cover_image' => $coverPath,
            'gallery_images' => $galleryPaths,
            'gift_link' => $data['gift_link'] ?? null,
            'map_link' => $data['map_link'] ?? null,
            'playlist_link' => $data['playlist_link'] ?? null,
            'theme_color' => $themeColor ?? $invitation->theme_color ?? '#7a159e',
            'font_color' => $fontColor ?? $invitation->font_color ?? '#ffffff',
        ]);

        Log::info('Invitation updated.', [
            'invitation_id' => $invitation->id,
            'theme_color_saved' => $invitation->theme_color,
            'theme_color_normalized' => $themeColor,
            'font_color_saved' => $invitation->font_color,
            'font_color_normalized' => $fontColor,
        ]);

        return redirect()->route('invitations.preview', $invitation);
    }
}
