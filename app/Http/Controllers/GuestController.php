<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index()
    {
        return Guest::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        try {
            // Criar convidado
            $guest = Guest::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);

            // Gerar link de convite dinâmico
            $guest->invite_link = route('invite', ['guest' => $guest->id]);
            $guest->save();

            // Redireciona de volta com mensagem de sucesso
            return redirect()->back()->with('success', 'Convidado cadastrado com sucesso!');
        } catch (\Exception $e) {
            \Log::error("Erro ao cadastrar convidado: " . $e->getMessage());

            return redirect()->back()->with('error', 'Erro ao cadastrar convidado.');
        }
    }


    public function destroy($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return response()->json(['message' => 'Guest deleted']);
    }

    public function invite(Guest $guest)
    {
        return view('invite', ['guest' => $guest]);
    }

}

