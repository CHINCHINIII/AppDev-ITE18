# CarSUcart

CarSUcart is a modern e-commerce platform built with a robust Laravel backend and a dynamic React frontend. It features a full-featured shopping experience including product browsing, cart management, secure checkout, user authentication, and an admin dashboard.

## Tech Stack

### Backend
- **Framework:** Laravel 12.x
- **Authentication:** Laravel Sanctum
- **Database:** MySQL
- **Testing:** Pest PHP

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Prerequisites

Ensure you have the following installed on your system:
- [PHP](https://www.php.net/) >= 8.2
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) & npm
- [MySQL](https://www.mysql.com/)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd carsucart
    ```

2.  **Install Backend Dependencies:**
    ```bash
    composer install
    ```

3.  **Configure Environment:**
    Copy the example environment file and configure your database credentials:
    ```bash
    cp .env.example .env
    ```
    Update the `DB_*` variables in `.env` to match your local MySQL configuration.

4.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```

5.  **Run Migrations & Seeders:**
    Set up the database schema and populate it with initial data:
    ```bash
    php artisan migrate --seed
    ```

6.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

## Development

To start the development environment, you can use the convenient Composer script that runs the Laravel server, Queue worker, and Vite development server concurrently:

```bash
composer run dev
```

Alternatively, you can run them in separate terminals:

*   **Backend:** `php artisan serve`
*   **Frontend:** `npm run dev`
*   **Queue:** `php artisan queue:listen`

## Directory Structure

- **`app/`**: Laravel application core code (Models, Controllers, etc.).
- **`src/`**: React application source code.
- **`database/`**: Database migrations, factories, and seeders.
- **`routes/`**: API and web route definitions.
- **`public/`**: Publicly accessible assets.
- **`tests/`**: Automated tests (Pest).
- **`frontend/`**: (Legacy/Alternative) Frontend directory.

## Testing

Run the PHP test suite using Pest:

```bash
php artisan test
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
