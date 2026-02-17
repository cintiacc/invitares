<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\GuestConfirmationController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvitationController;


Route::get('/', function () {
    return redirect('/login'); 
})->name('home');

Route::get('/convites/novo', fn() => Inertia::render('invitations/create'))
    ->name('invitations.create');

Route::get('/convites/tipo/aniversario', fn() => Inertia::render('invitations/types/aniversario'))
    ->name('invitations.types.aniversario');
Route::get('/convites/tipo/brunch', fn() => Inertia::render('invitations/types/brunch'))
    ->name('invitations.types.brunch');
Route::get('/convites/tipo/casamento', fn() => Inertia::render('invitations/types/casamento'))
    ->name('invitations.types.casamento');
Route::get('/convites/tipo/corporativo', fn() => Inertia::render('invitations/types/corporativo'))
    ->name('invitations.types.corporativo');
Route::get('/convites/tipo/cha', fn() => Inertia::render('invitations/types/cha'))
    ->name('invitations.types.cha');
Route::get('/convites/tipo/outro', fn() => Inertia::render('invitations/types/outro'))
    ->name('invitations.types.outro');


/**rotas para convidado */

Route::get('invite', fn() => Inertia::render('invitation'))->name('invitation');

Route::get('/invite/{guest}', [GuestController::class, 'invite'])->name('invite');

Route::get('/confirmar-presenca/{guest}', [GuestConfirmationController::class, 'confirm'])
    ->name('guests.confirm');

/**fim das rotas para convidado */


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::post('/convites', [InvitationController::class, 'store'])
        ->name('invitations.store');
    Route::get('/convites/{invitation}/preview', [InvitationController::class, 'preview'])
        ->name('invitations.preview');
    Route::get('/convites/{invitation}/editar', [InvitationController::class, 'edit'])
        ->name('invitations.edit');
    Route::put('/convites/{invitation}', [InvitationController::class, 'update'])
        ->name('invitations.update');
    Route::post('/convites/{invitation}', [InvitationController::class, 'update'])
        ->name('invitations.update.post');

    Route::post('/convites/{invitation}/guests', [GuestController::class, 'storeForInvitation'])
        ->name('invitations.guests.store');
    Route::post('/convites/{invitation}/guests/import', [GuestController::class, 'importCsv'])
        ->name('invitations.guests.import');
    Route::delete('/convites/{invitation}/guests/{guest}', [GuestController::class, 'destroyForInvitation'])
        ->name('invitations.guests.destroy');

    Route::post('/convites/{invitation}/gifts', [GiftController::class, 'storeForInvitation'])
        ->name('invitations.gifts.store');
    Route::delete('/convites/{invitation}/gifts/{gift}', [GiftController::class, 'destroyForInvitation'])
        ->name('invitations.gifts.destroy');

});

require __DIR__.'/settings.php';
