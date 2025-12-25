<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->integer('qty')->default(1);
            $table->decimal('price_at_purchase', 10, 2);
            $table->decimal('subtotal', 12, 2);
            $table->timestamp('order_date')->useCurrent();
            $table->tinyInteger('order_week')->nullable();
            $table->tinyInteger('order_month')->nullable();
            $table->smallInteger('order_year')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('order_items'); }
};
