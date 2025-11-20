<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'guests' => Guest::all()
        ]);
    }
}
