<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Exception;
use Illuminate\Support\Facades\Log;

class GuestConfirmationController extends Controller
{
    public function confirm(Guest $guest)
    {
        try {
            $request = request();
            $response = strtolower((string) $request->query('response', ''));
            $allowedResponses = ['accepted', 'rejected', 'maybe'];

            Log::info('Resposta de convite recebida.', [
                'guest_id' => $guest->id,
                'response_raw' => $response,
                'has_confirmed_query' => $request->has('confirmed'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            if (!in_array($response, $allowedResponses, true)) {
                if ($request->has('confirmed')) {
                    $response = $request->boolean('confirmed') ? 'accepted' : 'rejected';
                    Log::warning('Resposta recebida sem query response valida. Fallback por confirmed aplicado.', [
                        'guest_id' => $guest->id,
                        'resolved_response' => $response,
                    ]);
                } else {
                    $response = 'accepted';
                    Log::warning('Resposta recebida sem query response valida. Fallback padrao aplicado.', [
                        'guest_id' => $guest->id,
                        'resolved_response' => $response,
                    ]);
                }
            }

            Log::info('Resposta de convite normalizada.', [
                'guest_id' => $guest->id,
                'response' => $response,
            ]);

            $guest->update([
                'confirmed' => $response === 'accepted',
                'confirmed_at' => now(),
                'response_status' => $response,
            ]);
            $guest->load('invitation');

            Log::info('Resposta de convite registrada com sucesso.', [
                'guest_id' => $guest->id,
                'response_status' => $guest->response_status,
                'confirmed' => $guest->confirmed,
                'confirmed_at' => optional($guest->confirmed_at)->toISOString(),
            ]);

            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'ok' => true,
                    'message' => 'Resposta registrada com sucesso.',
                    'guest_id' => $guest->id,
                    'response_status' => $guest->response_status,
                ]);
            }

            return inertia('guest/confirmation-success', [
                'guest' => $guest,
                'invitation' => $guest->invitation,
                'invite_url' => route('invite', ['guest' => $guest->id]),
                'response_status' => $guest->response_status,
            ]);
        } catch (Exception $e) {
            Log::error('Erro ao confirmar presenca do convidado', [
                'guest_id' => $guest->id ?? null,
                'error_message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            if (request()->expectsJson() || request()->ajax()) {
                return response()->json([
                    'ok' => false,
                    'message' => 'Ocorreu um erro ao confirmar sua presenca. Tente novamente mais tarde.',
                ], 500);
            }

            return inertia('guest/confirmation-error', [
                'message' => 'Ocorreu um erro ao confirmar sua presenca. Tente novamente mais tarde.',
            ]);
        }
    }
}
