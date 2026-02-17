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
        Schema::table('guests', function (Blueprint $table) {
            if (!Schema::hasColumn('guests', 'invitation_id')) {
                $table->foreignId('invitation_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            }
        });

        Schema::table('guests', function (Blueprint $table) {
            if (Schema::hasColumn('guests', 'email')) {
                $table->dropUnique('guests_email_unique');
                $table->unique(['invitation_id', 'email'], 'guests_invitation_email_unique');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            if (Schema::hasColumn('guests', 'email')) {
                $table->dropUnique('guests_invitation_email_unique');
                $table->unique('email', 'guests_email_unique');
            }
        });

        Schema::table('guests', function (Blueprint $table) {
            if (Schema::hasColumn('guests', 'invitation_id')) {
                $table->dropConstrainedForeignId('invitation_id');
            }
        });
    }
};
