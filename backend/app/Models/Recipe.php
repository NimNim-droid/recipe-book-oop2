<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable (Encapsulation).
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'prep_time',
        'cook_time',
        'servings',
        'difficulty',
        'category',
        'image_url',
    ];

    /**
     * Relationship: Recipe has many ingredients (1-to-Many Association).
     */
    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class);
    }

    /**
     * Relationship: Recipe has many steps (1-to-Many Association).
     */
    public function steps(): HasMany
    {
        return $this->hasMany(Step::class)->orderBy('step_number', 'asc');
    }
}
