<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Support\Facades\Log;
use Exception;

class GuestConfirmationController extends Controller
{
    public function confirm(Guest $guest)
    {
        try {
            // Caso o convidado já tenha confirmado antes
            if ($guest->confirmed) {
                return inertia('guest/AlreadyConfirmed', [
                    'guest' => $guest,
                ]);
            }

            // Tenta atualizar o convidado
            $guest->update([
                'confirmed' => true,
                'confirmed_at' => now(),
            ]);

            return inertia('guest/ConfirmationSuccess', [
                'guest' => $guest,
            ]);

        } catch (Exception $e) {

            // 🔥 Loga o erro no laravel.log
            Log::error('Erro ao confirmar presença do convidado', [
                'guest_id' => $guest->id ?? null,
                'error_message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Redireciona para página genérica de erro
            return inertia('guest/ConfirmationError', [
                'message' => 'Ocorreu um erro ao confirmar sua presença. Tente novamente mais tarde.'
            ]);
        }
    }
}
