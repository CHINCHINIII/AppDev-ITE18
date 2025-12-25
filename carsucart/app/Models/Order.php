<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['buyer_id','cart_id','status','total','delivery_method','pickup_location', 'delivery_address'];

    public function buyer() { return $this->belongsTo(User::class, 'buyer_id'); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function cart() { return $this->belongsTo(Cart::class); }
}
