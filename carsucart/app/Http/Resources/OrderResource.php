<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'buyer_id' => $this->buyer_id,
            'cart_id' => $this->cart_id,
            'status' => $this->status,
            'total' => $this->total,
            'delivery_method' => $this->delivery_method,
            'pickup_location' => $this->pickup_location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'buyer' => new UserResource($this->whenLoaded('buyer')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}
