# Build the app
FROM php:7.4

# Install required packages and Apache
RUN apt-get update && apt-get install -yqq \
    unzip \
    libzip-dev \
    apache2 \
    && docker-php-ext-install pdo_mysql opcache zip \
    && rm -rf /var/lib/apt/lists/*

# Enable AutoProfile for PHP which is currently opt-in beta
RUN echo "instana.enable_auto_profile=1" > "/usr/local/etc/php/conf.d/zzz-instana-extras.ini"

# Enable Apache mod_rewrite and status
COPY status.conf /etc/apache2/mods-available/status.conf
RUN a2enmod rewrite && a2enmod status

# Set the working directory
WORKDIR /var/www/html

# Copy application files
COPY html/ /var/www/html

# Install Composer
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN composer install

# Set permissions for Symfony
RUN rm -Rf /var/www/var/* && \
    chown -R www-data /var/www && \
    chmod -R 777 /var/www

# Expose port 80
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2ctl", "-D", "FOREGROUND"]
