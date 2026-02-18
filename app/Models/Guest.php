<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'invitation_id',
        'name',
        'email',
        'phone',
        'confirmed',
        'confirmed_at',
        'response_status',
        'invite_link',
    ];

    protected $casts = [
        'confirmed' => 'boolean',
        'confirmed_at' => 'datetime',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
