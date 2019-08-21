const jwt = require ('jsonwebtoken');

module.exports = {
    auth : (req, res, next) => {
        console.log("Masuk")
        // console.log(req.method)
        if (req.method !== "OPTIONS") {
            // let success = true;
            const header = req.headers['authorization'];
            console.log(header)
            jwt.verify(header, "susahditebak", (error, decoded) => {
                if (error) {
                    // success = false;
                    return res.status(401).json({ message: "User not authorized.", error: "User not authorized." });
                }
                console.log(decoded)
                req.user = decoded;
                next();
            });
        } else {
            next();
        }
    }
}
