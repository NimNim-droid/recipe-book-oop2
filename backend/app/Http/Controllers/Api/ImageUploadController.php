<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    /**
     * Upload an image file from local device and return its publicly accessible URL.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif,avif|max:10240', // up to 10MB
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('recipes', $filename, 'public');

        // Build absolute URL for the stored image
        $url = url('storage/' . $path);

        return response()->json([
            'url' => $url,
            'filename' => $filename,
            'message' => 'Image uploaded successfully.',
        ], 201);
    }
}
