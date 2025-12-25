<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users');
            $table->foreignId('cart_id')->nullable()->constrained('cart')->nullOnDelete();
            $table->enum('status', ['pending','paid','completed','cancelled'])->default('pending');
            $table->decimal('total', 12, 2);
            $table->enum('delivery_method', ['pickup','delivery'])->default('pickup');
            $table->string('pickup_location')->nullable();
            $table->text('delivery_address')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('orders'); }
};
