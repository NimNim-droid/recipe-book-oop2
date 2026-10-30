<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipes = [
            [
                'title' => 'Creamy Tuscan Garlic Chicken',
                'description' => 'Crispy pan-seared chicken breasts smothered in a rich garlic, sun-dried tomato, and baby spinach cream sauce.',
                'prep_time' => 15,
                'cook_time' => 20,
                'servings' => 4,
                'difficulty' => 'Easy',
                'category' => 'Dinner',
                'image_url' => 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
                'ingredients' => [
                    ['name' => 'Chicken breasts', 'amount' => '2', 'unit' => 'large (halved)'],
                    ['name' => 'Heavy cream', 'amount' => '1', 'unit' => 'cup'],
                    ['name' => 'Garlic cloves, minced', 'amount' => '4', 'unit' => 'cloves'],
                    ['name' => 'Sun-dried tomatoes in oil', 'amount' => '1/2', 'unit' => 'cup'],
                    ['name' => 'Fresh baby spinach', 'amount' => '2', 'unit' => 'cups'],
                    ['name' => 'Grated Parmesan cheese', 'amount' => '1/2', 'unit' => 'cup'],
                    ['name' => 'Olive oil', 'amount' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Italian seasoning', 'amount' => '1', 'unit' => 'tsp'],
                ],
                'steps' => [
                    ['step_number' => 1, 'instruction' => 'Season chicken breasts with salt, black pepper, and Italian seasoning on both sides.'],
                    ['step_number' => 2, 'instruction' => 'Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5 minutes per side until golden brown and cooked through (165°F). Transfer to a plate.'],
                    ['step_number' => 3, 'instruction' => 'In the same skillet, add minced garlic and sun-dried tomatoes. Sauté for 1 minute until fragrant.'],
                    ['step_number' => 4, 'instruction' => 'Pour in the heavy cream and chicken broth. Bring to a gentle simmer, then stir in grated Parmesan until smooth and melted.'],
                    ['step_number' => 5, 'instruction' => 'Toss in the baby spinach and cook until wilted (about 2 minutes). Return the chicken to the skillet, spooning sauce over the top. Serve warm over pasta or crusty bread.'],
                ],
            ],
            [
                'title' => 'Authentic Neapolitan Margherita Pizza',
                'description' => 'A blistered, airy crust topped with San Marzano tomato sauce, fresh mozzarella di bufala, and torn aromatic basil leaves.',
                'prep_time' => 30,
                'cook_time' => 10,
                'servings' => 2,
                'difficulty' => 'Medium',
                'category' => 'Dinner',
                'image_url' => 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1200&q=80',
                'ingredients' => [
                    ['name' => 'Tipo 00 pizza flour', 'amount' => '300', 'unit' => 'grams'],
                    ['name' => 'Active dry yeast', 'amount' => '1/2', 'unit' => 'tsp'],
                    ['name' => 'San Marzano tomatoes, crushed', 'amount' => '3/4', 'unit' => 'cup'],
                    ['name' => 'Fresh buffalo mozzarella', 'amount' => '150', 'unit' => 'grams'],
                    ['name' => 'Fresh basil leaves', 'amount' => '8', 'unit' => 'leaves'],
                    ['name' => 'Extra virgin olive oil', 'amount' => '1', 'unit' => 'tbsp'],
                    ['name' => 'Fine sea salt', 'amount' => '1', 'unit' => 'tsp'],
                ],
                'steps' => [
                    ['step_number' => 1, 'instruction' => 'Mix flour, water, yeast, and salt. Knead for 10 minutes until smooth and elastic. Let ferment for at least 4 hours (or overnight).'],
                    ['step_number' => 2, 'instruction' => 'Preheat pizza stone or steel in your oven at maximum temperature (500°F / 260°C) for 45 minutes.'],
                    ['step_number' => 3, 'instruction' => 'Gently stretch dough from the center outwards on a floured peel, preserving an airy rim (cornicione).'],
                    ['step_number' => 4, 'instruction' => 'Spread crushed tomatoes lightly over the base, leaving a 1-inch border. Scatter torn mozzarella across the sauce.'],
                    ['step_number' => 5, 'instruction' => 'Bake for 7-9 minutes until crust is blistered and cheese is bubbling. Garnish immediately with fresh basil and a drizzle of olive oil.'],
                ],
            ],
            [
                'title' => 'Honey-Glazed Pan-Seared Salmon',
                'description' => 'Crispy skin salmon fillets glazed with a caramelized honey, soy, garlic, and freshly squeezed lemon reduction.',
                'prep_time' => 10,
                'cook_time' => 12,
                'servings' => 2,
                'difficulty' => 'Easy',
                'category' => 'Lunch',
                'image_url' => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
                'ingredients' => [
                    ['name' => 'Salmon fillets (skin-on)', 'amount' => '2', 'unit' => '6-oz fillets'],
                    ['name' => 'Pure wildflower honey', 'amount' => '3', 'unit' => 'tbsp'],
                    ['name' => 'Low-sodium soy sauce', 'amount' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Fresh lemon juice', 'amount' => '1', 'unit' => 'tbsp'],
                    ['name' => 'Garlic, minced', 'amount' => '2', 'unit' => 'cloves'],
                    ['name' => 'Butter', 'amount' => '1', 'unit' => 'tbsp'],
                    ['name' => 'Sesame seeds and sliced scallions', 'amount' => '1', 'unit' => 'pinch'],
                ],
                'steps' => [
                    ['step_number' => 1, 'instruction' => 'Pat salmon fillets dry with paper towels. Season both sides with sea salt and cracked black pepper.'],
                    ['step_number' => 2, 'instruction' => 'Whisk honey, soy sauce, lemon juice, and minced garlic together in a small bowl.'],
                    ['step_number' => 3, 'instruction' => 'Melt butter with a dash of oil in a non-stick skillet over medium-high heat. Place salmon skin-side down and sear undisturbed for 5 minutes.'],
                    ['step_number' => 4, 'instruction' => 'Flip salmon, pour in the honey soy glaze, and spoon the simmering sauce continuously over the fillets for 3-4 minutes until glazed and tender.'],
                    ['step_number' => 5, 'instruction' => 'Garnish with toasted sesame seeds and scallions. Serve with steamed jasmine rice.'],
                ],
            ],
            [
                'title' => 'Classic French Lemon Tart',
                'description' => 'A buttery pâte sablée crust filled with a silky, intensely tart lemon curd, baked to golden perfection.',
                'prep_time' => 40,
                'cook_time' => 30,
                'servings' => 8,
                'difficulty' => 'Hard',
                'category' => 'Dessert',
                'image_url' => 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
                'ingredients' => [
                    ['name' => 'Unsalted cold butter', 'amount' => '120', 'unit' => 'grams'],
                    ['name' => 'All-purpose flour', 'amount' => '200', 'unit' => 'grams'],
                    ['name' => 'Powdered sugar', 'amount' => '75', 'unit' => 'grams'],
                    ['name' => 'Fresh lemon juice', 'amount' => '150', 'unit' => 'ml'],
                    ['name' => 'Lemon zest', 'amount' => '2', 'unit' => 'lemons'],
                    ['name' => 'Large eggs', 'amount' => '4', 'unit' => 'whole eggs'],
                    ['name' => 'Granulated sugar', 'amount' => '150', 'unit' => 'grams'],
                ],
                'steps' => [
                    ['step_number' => 1, 'instruction' => 'Pulse flour, powdered sugar, and cold cubed butter in a food processor until sandy. Add 1 egg yolk and bring together into a dough disk. Chill for 1 hour.'],
                    ['step_number' => 2, 'instruction' => 'Roll pastry dough and line a 9-inch tart pan. Blind bake with pie weights at 350°F (175°C) for 15 minutes, remove weights, and bake 5 minutes more until golden.'],
                    ['step_number' => 3, 'instruction' => 'In a heatproof bowl set over simmering water, whisk eggs, sugar, lemon zest, and lemon juice constantly until thickened (about 10 minutes).'],
                    ['step_number' => 4, 'instruction' => 'Remove curd from heat and whisk in remaining room-temperature butter until glossy and emulsified.'],
                    ['step_number' => 5, 'instruction' => 'Pour warm lemon curd into pre-baked crust, smooth the top, and chill for at least 3 hours before slicing.'],
                ],
            ],
        ];

        foreach ($recipes as $data) {
            $ingredients = $data['ingredients'];
            $steps = $data['steps'];
            unset($data['ingredients'], $data['steps']);

            $recipe = Recipe::create($data);

            foreach ($ingredients as $ing) {
                $recipe->ingredients()->create($ing);
            }

            foreach ($steps as $st) {
                $recipe->steps()->create($st);
            }
        }
    }
}
