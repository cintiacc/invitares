<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function store(Request $request)
    {
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
            'cover_image' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
        ]);

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
        ]);

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
        ]);
    }

    public function update(Request $request, Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
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
            'cover_image' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048',
        ]);

        $coverPath = $invitation->cover_image;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('invitations/covers', 'public');
        }

        $galleryPaths = $invitation->gallery_images ?? [];
        if ($request->hasFile('gallery_images')) {
            $galleryPaths = [];
            foreach ($request->file('gallery_images') as $file) {
                if (!$file) {
                    continue;
                }
                $galleryPaths[] = $file->store('invitations/gallery', 'public');
            }
        }

        $invitation->update([
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
        ]);

        return redirect()->route('invitations.preview', $invitation);
    }
}
