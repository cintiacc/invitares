<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class GuestController extends Controller
{
    public function storeForInvitation(Request $request, Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
            ]);

            $guest = Guest::create([
                'invitation_id' => $invitation->id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);

            $guest->invite_link = route('invite', ['guest' => $guest->id]);
            $guest->save();

            return redirect()->back()->with('success', 'Convidado cadastrado com sucesso!');
        } catch (ValidationException $e) {
            Log::warning('Erro de validaÃ§Ã£o ao cadastrar convidado', [
                'invitation_id' => $invitation->id,
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Erro ao cadastrar convidado', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Erro ao cadastrar convidado.');
        }
    }

    public function destroyForInvitation(Request $request, Invitation $invitation, Guest $guest)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }
        if ($guest->invitation_id !== $invitation->id) {
            abort(404);
        }

        $guest->delete();

        return redirect()->back()->with('success', 'Convidado removido com sucesso.');
    }

    public function importCsv(Request $request, Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt|max:2048',
            ]);

            $file = $request->file('file');
            $path = $file->getRealPath();
            if (!$path) {
                return redirect()->back()->with('error', 'Arquivo CSV invÃ¡lido.');
            }

            $handle = fopen($path, 'r');
            if (!$handle) {
                return redirect()->back()->with('error', 'NÃ£o foi possÃ­vel abrir o CSV.');
            }

            $header = fgetcsv($handle);
            $header = $header ? array_map(fn($value) => strtolower(trim($value)), $header) : [];

            $hasHeader = in_array('nome', $header, true) || in_array('name', $header, true);
            if (!$hasHeader) {
                rewind($handle);
                $header = ['name', 'email', 'phone'];
            }

            $created = 0;
            $skipped = 0;

            while (($row = fgetcsv($handle)) !== false) {
                $row = array_map('trim', $row);
                if (count($row) === 0 || ($row[0] ?? '') === '') {
                    continue;
                }

                $data = array_combine($header, array_pad($row, count($header), null));
                $name = $data['name'] ?? $data['nome'] ?? null;
                $email = $data['email'] ?? null;
                $phone = $data['phone'] ?? $data['telefone'] ?? null;

                if (!$name || !$email) {
                    $skipped++;
                    continue;
                }

                try {
                    $guest = Guest::create([
                        'invitation_id' => $invitation->id,
                        'name' => $name,
                        'email' => $email,
                        'phone' => $phone,
                    ]);
                    $guest->invite_link = route('invite', ['guest' => $guest->id]);
                    $guest->save();
                    $created++;
                } catch (\Exception $e) {
                    $skipped++;
                    Log::warning('Falha ao importar convidado', [
                        'invitation_id' => $invitation->id,
                        'email' => $email,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            fclose($handle);

            return redirect()->back()->with('success', "ImportaÃ§Ã£o concluÃ­da. Criados: {$created}. Ignorados: {$skipped}.");
        } catch (ValidationException $e) {
            Log::warning('Erro de validaÃ§Ã£o na importaÃ§Ã£o de CSV', [
                'invitation_id' => $invitation->id,
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Erro ao importar CSV de convidados', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Erro ao importar CSV.');
        }
    }

    public function invite(Guest $guest)
    {
        $guest->load('invitation');

        if (!$guest->invitation) {
            abort(404);
        }

        return inertia('invitation', [
            'guest' => $guest,
            'invitation' => $guest->invitation,
        ]);
    }

    public function confirm(Request $request, Guest $guest)
    {
        try {
            $guest->update([
                'confirmed' => $request->boolean('confirmed'),
                'confirmed_at' => now(),
            ]);

            return back()->with('success', 'PresenÃ§a registrada!');
        } catch (\Exception $e) {
            Log::error('Erro ao confirmar presenÃ§a', [
                'guest_id' => $guest->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Erro ao registrar presenÃ§a.');
        }
    }
}
