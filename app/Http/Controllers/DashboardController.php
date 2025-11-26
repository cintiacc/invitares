<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Gift;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'guests' => Guest::all(),
            'gifts' => Gift::all(),
        ]);
    }
}
