<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('gifts', function (Blueprint $table) {
            $table->string('link', 1000)->change(); // aumenta para 1000 caracteres
            $table->string('image_link', 1000)->nullable()->change(); // se quiser aumentar também
        });
    }

    public function down(): void
    {
        Schema::table('gifts', function (Blueprint $table) {
            $table->string('link', 255)->change();
            $table->string('image_link', 255)->nullable()->change();
        });
    }
};

