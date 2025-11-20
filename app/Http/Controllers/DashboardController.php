<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $guests = Guest::all(); // pega todos os convidados do banco

        return Inertia::render('Dashboard', [
            'guests' => $guests,
        ]);
    }
}
