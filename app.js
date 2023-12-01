const express = require('express');
const app = express();
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Storpenisdreng1',
    database: 'student_cafe_app'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.use(express.json());



// Alle cafes - Virker
app.get('/api/cafes', (req, res) => {
    const getAllCafes = 'select * from cafes';
    connection.query(getAllCafes, (err, results) => {
        if (err){
            return res.status(500).json({error: err.message})
        }
        res.json(results)
    });
});

// Specific cafe - Virker
app.get('/api/cafes/:id', (req, res) => {
    const cafeId = req.params.id;
    const getCafeId = 'select * from cafes where id = ?';
    connection.query(getCafeId, [cafeId],  (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0){
            return res.status(404).json({message: 'Cafe not found'})
        }
        res.json(results[0]);
    });
})

// query for by - virker
app.get('/api/cafes/city/:cityName', (req, res) => {
    const cityName = req.params.cityName;
    const getCafesByCity = 'select * from cafes where city = ?';

    connection.query(getCafesByCity, [cityName],  (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0){
            return res.status(404).json({message: 'Sorry, no such café'})
        }
        res.json(results);
    });
})


// Opret cafe - Virker

// {
// "name": "Flipper",
// "city": "Slagelse",
// "address": "Skippervej 42",
// "wifi_available": true,
// "noise_level": 8.4,
// "coffee_quality": 6.5
// }

// Virker
app.post('/api/create-cafe', (req, res) => {
    const { name, city, address, wifi_available, noise_level, coffee_quality } = req.body;

    const insertQueryCafe = 'INSERT INTO cafes (name, city, address, wifi_available, noise_level, coffee_quality) VALUES (?, ?, ?, ?, ?, ?)';
    const insertValuesCafe = [name, city, address, wifi_available, noise_level, coffee_quality];

    connection.query(insertQueryCafe, insertValuesCafe, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cafe created', id: results.insertId });
    });
});



// Alle brugere - Virker
app.get('/api/users', (req, res) => {
    connection.query('select * from users', (err, results) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.json(results);
    });
});

// Specific bruger - Virker
app.get('/api/user/:userid', (req, res) => {
    const userId = req.params.userid;
    const getUserId = 'select * from users where userid = ?';
    connection.query(getUserId, [userId],  (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0){
            return res.status(404).json({message: 'User not found'})
        }
        res.json(results[0]);
    });
});

// Opret bruger - VIRKER
app.post('/api/user/create', (req, res) => {
    const { name, email, city} = req.body;
        if (!name || !email) {
            return res.status(400).send('Name and email are required');
        }
    connection.query('insert into users (name, email, city) VALUES (?, ?, ?)',
        [name, email, city],
        (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newUser = {
            id: results.insertId,
            name,
            email,
    };

            res.status(201).json({ message: 'User created', user: newUser });
        });

});




// alt førhen virker som det skal - bortset fra at userid ikke bennytter slettede entiteter og dermed fortsætter optælning



app.post('/api/user/:userId/favorites', (req, res) => {
    const userId = req.params.userId;
    const cafeId = req.body.cafeId;

    const addToFavoritesQuery = 'INSERT INTO favorites (user_id, cafe_id) VALUES (?, ?)';
    connection.query(addToFavoritesQuery, [userId, cafeId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Restaurant added to favorites' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});