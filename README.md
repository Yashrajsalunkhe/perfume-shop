<<<<<<< HEAD
# perfume-shop
# perfume-shop
=======
# Perfume E-Shop

A modern e-commerce website for perfumes built with HTML, CSS, JavaScript, PHP, and MongoDB.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Product Catalog**: Browse perfumes by category (Men, Women, Premium)
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Login/Register functionality
- **Search & Filter**: Find products by name, brand, or category
- **Modern UI**: Clean and attractive design with smooth animations

## Project Structure

```
perfume-shop/
├── index.html              # Homepage
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   ├── homepage.css    # Homepage styles
│   │   ├── login.css       # Login page styles
│   │   ├── shop.css        # Shop page styles
│   │   └── cart.css        # Cart page styles
│   ├── js/
│   │   ├── main.js         # Main JavaScript functionality
│   │   ├── login.js        # Login functionality
│   │   ├── shop.js         # Shop page functionality
│   │   ├── cart.js         # Cart functionality
│   │   └── homepage.js     # Homepage functionality
│   └── images/             # Image assets
├── pages/
│   ├── login.html          # Login page
│   ├── shop.html           # Product listing page
│   ├── cart.html           # Shopping cart page
│   ├── men.html            # Men's perfumes
│   ├── women.html          # Women's perfumes
│   └── premium.html        # Premium collection
├── api/
│   ├── products.php        # Product API endpoints
│   ├── auth.php            # Authentication API
│   └── orders.php          # Order management API
├── config/
│   └── database.php        # Database configuration
└── includes/               # PHP includes and utilities
```

## Setup Instructions

### Prerequisites

1. **Web Server**: Apache or Nginx with PHP support
2. **PHP**: Version 7.4 or higher
3. **MongoDB**: Version 4.0 or higher
4. **MongoDB PHP Driver**: Install using PECL

### Installation

1. **Clone or Download** the project to your web server directory

2. **Install MongoDB PHP Driver**:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install php-mongodb

   # Using PECL
   sudo pecl install mongodb
   ```

3. **Configure MongoDB**:
   - Start MongoDB service: `sudo systemctl start mongod`
   - Create database: `perfume_shop`

4. **Update Database Configuration**:
   - Edit `config/database.php`
   - Update MongoDB connection details if needed

5. **Set File Permissions**:
   ```bash
   chmod -R 755 /path/to/perfume-shop
   ```

6. **Start Web Server**:
   - Make sure your web server is running
   - Access the application via: `http://localhost/perfume-shop`

### Sample Data

To populate the database with sample products, you can use the following MongoDB commands:

```javascript
// Connect to MongoDB and use the perfume_shop database
use perfume_shop

// Insert sample products
db.products.insertMany([
  {
    name: "Creed Aventus",
    description: "Creed Aventus type Perfume",
    brand: "Creed",
    category: "men",
    price: 750,
    original_price: 1500,
    image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcReTTpc2D1I9eGOxQSrLqn3WfcwVfaqlNnCQHmXwnxp3Gmh6vPt7yJfTx2snf3bPUUSAOwwQJ5Rr-W5bsRNpOSGDRHKZ4_-ZiLMQgHUpTcnF6O5RBSVoCJb",
    stock: 100,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Tom Ford Oud Wood",
    description: "Oud Wood type Perfume",
    brand: "Tom Ford",
    category: "men",
    price: 750,
    original_price: 1500,
    image_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSIRTlsci9Ib_kmDNRMaWOlJ1AjHx4kUUuUDL75ew-hBtIoA9yuzzE3tW271gAofUET-WJ_TzcwLr92yUckoVFSsVcyWdy4z66RaK62_E-UUAPH9Kxh-ydtYk",
    stock: 100,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Versace Eros",
    description: "Versace Eros type Perfume",
    brand: "Versace",
    category: "men",
    price: 750,
    original_price: 1500,
    image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTWmdCHkt2cKKnrLItHhdeaJBDMpZABrlnR5AetzbII5j96hsiPFYs35aGGtgGhAKAgtiWxc-y6uxwNTaRUhM1XNlG3X9Lt6Jsb36Y3YOqEjCJ99aF7ukzS",
    stock: 100,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
])

// Create a sample user
db.users.insertOne({
  username: "admin",
  email: "admin@perfume.in",
  full_name: "Admin User",
  password_hash: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
  created_at: Math.floor(Date.now() / 1000),
  last_login: null,
  is_active: true
})
```

## Usage

1. **Homepage**: Visit `index.html` to see the main page
2. **Browse Products**: Click "Shop" to view all products
3. **Login**: Use the login page with demo credentials:
   - Username: `admin`
   - Password: `admin123`
4. **Add to Cart**: Click "Add to Cart" on any product
5. **View Cart**: Check your cart and proceed to checkout

## API Endpoints

### Products API (`/api/products.php`)
- `GET /api/products.php` - Get all products
- `GET /api/products.php?category=men` - Get products by category
- `GET /api/products.php?search=creed` - Search products
- `POST /api/products.php` - Create new product
- `PUT /api/products.php/{id}` - Update product
- `DELETE /api/products.php/{id}` - Delete product

### Authentication API (`/api/auth.php`)
- `POST /api/auth.php/login` - User login
- `POST /api/auth.php/register` - User registration
- `POST /api/auth.php/logout` - User logout

## Development

### Adding New Pages
1. Create HTML file in appropriate directory
2. Add corresponding CSS in `assets/css/`
3. Add JavaScript functionality in `assets/js/`
4. Update navigation in all pages

### Customization
- **Colors**: Update CSS variables in `assets/css/main.css`
- **Fonts**: Add new font imports in HTML files
- **Images**: Store in `assets/images/` directory

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MongoDB
- **Styling**: Custom CSS with Flexbox and Grid
- **Icons**: Font Awesome (optional)

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please contact:
- Email: info@perfume.in
- GitHub: Create an issue in this repository
>>>>>>> 9b2177c (new structure)
