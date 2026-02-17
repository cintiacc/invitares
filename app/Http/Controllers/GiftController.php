<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class GiftController extends Controller
{
    public function storeForInvitation(Request $request, Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'link' => 'required|url|max:1000',
                'image_link' => 'nullable|url|max:1000',
            ]);

            Gift::create([
                'invitation_id' => $invitation->id,
                'name' => $data['name'],
                'link' => $data['link'],
                'image_link' => $data['image_link'] ?? null,
            ]);

            return redirect()->back()->with('success', 'Presente adicionado com sucesso!');
        } catch (ValidationException $e) {
            Log::warning('Erro de validaÃ§Ã£o ao cadastrar presente', [
                'invitation_id' => $invitation->id,
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Erro ao cadastrar presente', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'NÃ£o foi possÃ­vel adicionar o presente.');
        }
    }

    public function destroyForInvitation(Request $request, Invitation $invitation, Gift $gift)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }
        if ($gift->invitation_id !== $invitation->id) {
            abort(404);
        }

        try {
            $gift->delete();

            return redirect()->back()->with('success', 'Presente removido com sucesso!');
        } catch (\Exception $e) {
            Log::error('Erro ao deletar presente', [
                'gift_id' => $gift->id,
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Erro ao remover o presente.');
        }
    }
}
