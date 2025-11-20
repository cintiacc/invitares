<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class GiftController extends Controller
{
    /**
     * Exibe lista de presentes
     */
    public function index()
    {
        try {
            $gifts = Gift::all();

            return inertia('gifts/Index', [
                'gifts' => $gifts,
                'success' => session('success'),
                'error' => session('error'),
            ]);

        } catch (Exception $e) {

            Log::error('Erro ao listar presentes', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            return inertia('gifts/Index', [
                'gifts' => [],
                'error' => 'Não foi possível carregar a lista de presentes.'
            ]);
        }
    }

    /**
     * Salva novo presente
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'link' => 'required|url|max:255',
            ]);

            Gift::create($data);

            // Alert no Laravel (Inertia recebe no props)
            session()->flash('success', 'Presente adicionado com sucesso!');

            return redirect()->back();

        } catch (Exception $e) {

            Log::error('Erro ao cadastrar presente', [
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            session()->flash('error', 'Não foi possível adicionar o presente.');

            return redirect()->back();
        }
    }

    /**
     * Remove um presente
     */
    public function destroy(Gift $gift)
    {
        try {
            $gift->delete();

            session()->flash('success', 'Presente removido com sucesso!');

            return redirect()->back();

        } catch (Exception $e) {

            Log::error('Erro ao deletar presente', [
                'gift_id' => $gift->id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            session()->flash('error', 'Erro ao remover o presente.');

            return redirect()->back();
        }
    }
}
