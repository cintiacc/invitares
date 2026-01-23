<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Gift;
use App\Models\Invitation;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'invitations' => Invitation::where('user_id', auth()->id())->latest()->get(),
            'guests' => Guest::all(),
            'gifts' => Gift::all(),
        ]);
    }
}
