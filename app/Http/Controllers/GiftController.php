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
            // Validação
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'link' => 'required|url|max:1000',
                'image_link' => 'nullable|url|max:1000',
            ]);

            Gift::create($data);

            // Sucesso
            return redirect()->back()->with('success', 'Presente adicionado com sucesso!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retorna os erros de validação
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Log do erro
            \Log::error('Erro ao cadastrar presente', [
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Não foi possível adicionar o presente.');
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
