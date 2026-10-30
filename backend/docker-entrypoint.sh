#!/bin/bash
set -e

# Support Render custom PORT if passed
if [ -n "$PORT" ]; then
    sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
    sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:$PORT>/g" /etc/apache2/sites-available/000-default.conf
fi

# Ensure sqlite database file exists and has correct permissions
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Creating SQLite database file..."
    touch /var/www/html/database/database.sqlite
fi
chown -R www-data:www-data /var/www/html/database
chmod -R 775 /var/www/html/database

# Ensure public storage symlink exists for recipe images
echo "Linking storage..."
php artisan storage:link --no-interaction || true

# Run database migrations and seed default recipes
echo "Running migrations..."
php artisan migrate --force --no-interaction

echo "Seeding database..."
php artisan db:seed --force --no-interaction || true

# Cache routes and config for production performance
if [ "$APP_ENV" = "production" ] && [ -n "$APP_KEY" ]; then
    echo "Caching configuration and routes..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Ensure storage directory permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "Starting Apache server..."
exec apache2-foreground
