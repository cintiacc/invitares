<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\GuestConfirmationController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return redirect('/login'); 
})->name('home');


/**rotas para convidado */

Route::get('invite', fn() => Inertia::render('invitation'))->name('invitation');

Route::get('/invite/{guest}', [GuestController::class, 'invite'])->name('invite');

Route::get('/confirmar-presenca/{guest}', [GuestConfirmationController::class, 'confirm'])
    ->name('guests.confirm');

/**fim das rotas para convidado */


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

     Route::get('/guests', [GuestController::class, 'index'])->name('guests.index');
        Route::post('/guests', [GuestController::class, 'store'])->name('guests.store');
        Route::delete('/guests/{id}', [GuestController::class, 'destroy'])->name('guests.destroy');
});

require __DIR__.'/settings.php';
