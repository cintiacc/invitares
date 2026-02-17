<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gift extends Model
{
    protected $fillable = [
        'invitation_id',
        'name',
        'link',
        'image_link',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
