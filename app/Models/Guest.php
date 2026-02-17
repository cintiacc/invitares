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
        'invite_link',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
