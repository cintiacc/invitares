<?php

namespace Tests\Feature;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InvitationMediaRemovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_cover_image_can_be_removed_and_deleted_from_storage(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $invitation = $this->createInvitation($user, [
            'cover_image' => 'invitations/covers/cover-old.jpg',
        ]);
        Storage::disk('public')->put('invitations/covers/cover-old.jpg', 'cover');

        $this->actingAs($user)->put(route('invitations.update', $invitation), [
            'type' => $invitation->type,
            'title' => $invitation->title,
            'remove_cover_image' => true,
        ])->assertRedirect(route('invitations.preview', $invitation));

        $invitation->refresh();

        $this->assertNull($invitation->cover_image);
        Storage::disk('public')->assertMissing('invitations/covers/cover-old.jpg');
    }

    public function test_selected_gallery_images_can_be_removed_and_deleted(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $invitation = $this->createInvitation($user, [
            'gallery_images' => [
                'invitations/gallery/a.jpg',
                'invitations/gallery/b.jpg',
                'invitations/gallery/c.jpg',
            ],
        ]);

        Storage::disk('public')->put('invitations/gallery/a.jpg', 'a');
        Storage::disk('public')->put('invitations/gallery/b.jpg', 'b');
        Storage::disk('public')->put('invitations/gallery/c.jpg', 'c');

        $this->actingAs($user)->put(route('invitations.update', $invitation), [
            'type' => $invitation->type,
            'title' => $invitation->title,
            'removed_gallery_images' => ['invitations/gallery/b.jpg'],
        ])->assertRedirect(route('invitations.preview', $invitation));

        $invitation->refresh();

        $this->assertSame(
            ['invitations/gallery/a.jpg', 'invitations/gallery/c.jpg'],
            $invitation->gallery_images
        );
        Storage::disk('public')->assertMissing('invitations/gallery/b.jpg');
        Storage::disk('public')->assertExists('invitations/gallery/a.jpg');
        Storage::disk('public')->assertExists('invitations/gallery/c.jpg');
    }

    public function test_invalid_removed_gallery_paths_are_ignored(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $invitation = $this->createInvitation($user, [
            'gallery_images' => [
                'invitations/gallery/a.jpg',
            ],
        ]);

        Storage::disk('public')->put('invitations/gallery/a.jpg', 'a');
        Storage::disk('public')->put('invitations/gallery/not-owned.jpg', 'x');

        $this->actingAs($user)->put(route('invitations.update', $invitation), [
            'type' => $invitation->type,
            'title' => $invitation->title,
            'removed_gallery_images' => ['invitations/gallery/not-owned.jpg'],
        ])->assertRedirect(route('invitations.preview', $invitation));

        $invitation->refresh();

        $this->assertSame(['invitations/gallery/a.jpg'], $invitation->gallery_images);
        Storage::disk('public')->assertExists('invitations/gallery/a.jpg');
        Storage::disk('public')->assertExists('invitations/gallery/not-owned.jpg');
    }

    public function test_user_cannot_update_invitation_from_another_user(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $invitation = $this->createInvitation($owner);

        $this->actingAs($otherUser)->put(route('invitations.update', $invitation), [
            'type' => $invitation->type,
            'title' => $invitation->title,
            'remove_cover_image' => true,
        ])->assertForbidden();
    }

    public function test_removal_and_new_gallery_upload_replace_old_files_without_orphans(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $invitation = $this->createInvitation($user, [
            'gallery_images' => [
                'invitations/gallery/old-a.jpg',
                'invitations/gallery/old-b.jpg',
            ],
        ]);

        Storage::disk('public')->put('invitations/gallery/old-a.jpg', 'a');
        Storage::disk('public')->put('invitations/gallery/old-b.jpg', 'b');
        $tinyPng = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5l9WQAAAAASUVORK5CYII=');

        $this->actingAs($user)->put(route('invitations.update', $invitation), [
            'type' => $invitation->type,
            'title' => $invitation->title,
            'removed_gallery_images' => ['invitations/gallery/old-a.jpg'],
            'gallery_images' => [
                UploadedFile::fake()->createWithContent('new-1.png', $tinyPng),
                UploadedFile::fake()->createWithContent('new-2.png', $tinyPng),
            ],
        ])->assertRedirect(route('invitations.preview', $invitation));

        $invitation->refresh();

        $this->assertCount(2, $invitation->gallery_images ?? []);
        foreach ($invitation->gallery_images as $path) {
            Storage::disk('public')->assertExists($path);
        }

        Storage::disk('public')->assertMissing('invitations/gallery/old-a.jpg');
        Storage::disk('public')->assertMissing('invitations/gallery/old-b.jpg');
    }

    private function createInvitation(User $user, array $overrides = []): Invitation
    {
        return Invitation::create(array_merge([
            'user_id' => $user->id,
            'type' => 'aniversario',
            'title' => 'Convite de teste',
            'subtitle' => null,
            'event_date' => null,
            'event_time' => null,
            'location' => null,
            'message' => null,
            'details' => null,
            'note' => null,
            'cover_image' => null,
            'gallery_images' => [],
            'gift_link' => null,
            'map_link' => null,
            'playlist_link' => null,
            'theme_color' => '#7a159e',
            'font_color' => '#ffffff',
        ], $overrides));
    }
}
