<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $invitations = Invitation::where('user_id', $userId)
            ->latest()
            ->get();

        $latestUpdates = Guest::query()
            ->whereNotNull('confirmed_at')
            ->whereHas('invitation', fn ($query) => $query->where('user_id', $userId))
            ->with('invitation:id,title')
            ->latest('confirmed_at')
            ->limit(10)
            ->get()
            ->map(function (Guest $guest) {
                $status = match ($guest->response_status) {
                    'accepted' => 'aceitou',
                    'rejected' => 'nao aceitou',
                    'maybe' => 'marcou como talvez',
                    default => $guest->confirmed ? 'aceitou' : 'nao aceitou',
                };

                return [
                    'id' => $guest->id,
                    'guest_name' => $guest->name,
                    'invitation_title' => $guest->invitation?->title ?? 'convite',
                    'status_text' => $status,
                    'confirmed_at' => optional($guest->confirmed_at)->toISOString(),
                ];
            })
            ->values();

        return Inertia::render('dashboard', [
            'invitations' => $invitations,
            'latest_updates' => $latestUpdates,
        ]);
    }
}
