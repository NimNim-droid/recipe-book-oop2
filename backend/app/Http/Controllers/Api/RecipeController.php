<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource with optional search and filtering.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Recipe::with(['ingredients', 'steps'])->latest();

        // Optional search by recipe title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('ingredients', function ($iq) use ($search) {
                      $iq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Optional category filter
        if ($request->filled('category') && $request->input('category') !== 'All') {
            $query->where('category', $request->input('category'));
        }

        // Optional difficulty filter
        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->input('difficulty'));
        }

        $recipes = $query->get();

        return RecipeResource::collection($recipes);
    }

    /**
     * Store a newly created recipe with ingredients and steps in an atomic transaction.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prep_time' => 'nullable|integer|min:0',
            'cook_time' => 'nullable|integer|min:0',
            'servings' => 'nullable|integer|min:1',
            'difficulty' => 'nullable|string|in:Easy,Medium,Hard',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'ingredients' => 'nullable|array',
            'ingredients.*.name' => 'required_with:ingredients|string|max:255',
            'ingredients.*.amount' => 'nullable|string|max:50',
            'ingredients.*.unit' => 'nullable|string|max:50',
            'steps' => 'nullable|array',
            'steps.*.instruction' => 'required_with:steps|string',
            'steps.*.step_number' => 'nullable|integer',
        ]);

        $recipe = DB::transaction(function () use ($validated) {
            $recipe = Recipe::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'prep_time' => $validated['prep_time'] ?? 0,
                'cook_time' => $validated['cook_time'] ?? 0,
                'servings' => $validated['servings'] ?? 4,
                'difficulty' => $validated['difficulty'] ?? 'Medium',
                'category' => $validated['category'] ?? 'Dinner',
                'image_url' => $validated['image_url'] ?? null,
            ]);

            // Save ingredients
            if (!empty($validated['ingredients'])) {
                foreach ($validated['ingredients'] as $ingredientData) {
                    if (!empty(trim($ingredientData['name'] ?? ''))) {
                        $recipe->ingredients()->create([
                            'name' => trim($ingredientData['name']),
                            'amount' => $ingredientData['amount'] ?? null,
                            'unit' => $ingredientData['unit'] ?? null,
                        ]);
                    }
                }
            }

            // Save steps
            if (!empty($validated['steps'])) {
                $stepNumber = 1;
                foreach ($validated['steps'] as $stepData) {
                    if (!empty(trim($stepData['instruction'] ?? ''))) {
                        $recipe->steps()->create([
                            'step_number' => $stepData['step_number'] ?? $stepNumber++,
                            'instruction' => trim($stepData['instruction']),
                        ]);
                    }
                }
            }

            return $recipe;
        });

        return (new RecipeResource($recipe->load(['ingredients', 'steps'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified recipe with eager-loaded ingredients and steps.
     */
    public function show(Recipe $recipe): RecipeResource
    {
        $recipe->load(['ingredients', 'steps']);
        return new RecipeResource($recipe);
    }

    /**
     * Update the specified recipe, synchronizing ingredients and steps atomically.
     */
    public function update(Request $request, Recipe $recipe): RecipeResource
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prep_time' => 'nullable|integer|min:0',
            'cook_time' => 'nullable|integer|min:0',
            'servings' => 'nullable|integer|min:1',
            'difficulty' => 'nullable|string|in:Easy,Medium,Hard',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
            'ingredients' => 'nullable|array',
            'ingredients.*.name' => 'required_with:ingredients|string|max:255',
            'ingredients.*.amount' => 'nullable|string|max:50',
            'ingredients.*.unit' => 'nullable|string|max:50',
            'steps' => 'nullable|array',
            'steps.*.instruction' => 'required_with:steps|string',
            'steps.*.step_number' => 'nullable|integer',
        ]);

        DB::transaction(function () use ($recipe, $validated) {
            $recipe->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'prep_time' => $validated['prep_time'] ?? 0,
                'cook_time' => $validated['cook_time'] ?? 0,
                'servings' => $validated['servings'] ?? 4,
                'difficulty' => $validated['difficulty'] ?? 'Medium',
                'category' => $validated['category'] ?? 'Dinner',
                'image_url' => $validated['image_url'] ?? null,
            ]);

            // Synchronize ingredients if provided
            if (isset($validated['ingredients'])) {
                $recipe->ingredients()->delete();
                foreach ($validated['ingredients'] as $ingredientData) {
                    if (!empty(trim($ingredientData['name'] ?? ''))) {
                        $recipe->ingredients()->create([
                            'name' => trim($ingredientData['name']),
                            'amount' => $ingredientData['amount'] ?? null,
                            'unit' => $ingredientData['unit'] ?? null,
                        ]);
                    }
                }
            }

            // Synchronize steps if provided
            if (isset($validated['steps'])) {
                $recipe->steps()->delete();
                $stepNumber = 1;
                foreach ($validated['steps'] as $stepData) {
                    if (!empty(trim($stepData['instruction'] ?? ''))) {
                        $recipe->steps()->create([
                            'step_number' => $stepData['step_number'] ?? $stepNumber++,
                            'instruction' => trim($stepData['instruction']),
                        ]);
                    }
                }
            }
        });

        return new RecipeResource($recipe->load(['ingredients', 'steps']));
    }

    /**
     * Remove the specified recipe from storage (cascading deletes child entities).
     */
    public function destroy(Recipe $recipe): JsonResponse
    {
        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully.',
        ], 200);
    }
}
