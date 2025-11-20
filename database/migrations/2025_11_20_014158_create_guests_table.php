<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();

            // Dados básicos do convidado
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            // Confirmação de presença
            $table->boolean('confirmed')->default(false);       // se confirmou ou não
            $table->timestamp('confirmed_at')->nullable();       // quando confirmou
            $table->string('invite_link')->nullable(); // <--- link dinâmico

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
