<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'confirmed',
        'confirmed_at',
        'invite_link',
    ];
}
