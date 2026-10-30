<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'prep_time' => (int) $this->prep_time,
            'cook_time' => (int) $this->cook_time,
            'total_time' => ((int) $this->prep_time) + ((int) $this->cook_time),
            'servings' => (int) ($this->servings ?: 4),
            'difficulty' => $this->difficulty ?: 'Medium',
            'category' => $this->category,
            'image_url' => $this->image_url,
            'ingredients' => IngredientResource::collection($this->whenLoaded('ingredients')),
            'steps' => StepResource::collection($this->whenLoaded('steps')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
