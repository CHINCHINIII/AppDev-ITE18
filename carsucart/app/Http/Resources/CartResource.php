<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'user_id' => $this->user_id,
            'updated_at' => $this->updated_at,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total' => $this->when(isset($this->total), $this->total),
            'item_count' => $this->when(isset($this->item_count), $this->item_count),
        ];
    }
}
