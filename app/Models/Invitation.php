<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'subtitle',
        'event_date',
        'event_time',
        'location',
        'message',
        'details',
        'note',
        'cover_image',
        'gallery_images',
        'gift_link',
        'map_link',
        'playlist_link',
        'theme_color',
        'font_color',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'event_date' => 'date',
    ];

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function gifts()
    {
        return $this->hasMany(Gift::class);
    }
}
