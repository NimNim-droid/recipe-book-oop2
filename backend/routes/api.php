<?php

use App\Http\Controllers\Api\RecipeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint for Render/deployment ping
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Savoria Culinary API is running smoothly.',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// RESTful Recipe API Resource routes (index, store, show, update, destroy)
Route::apiResource('recipes', RecipeController::class);
