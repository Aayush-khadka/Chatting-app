import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "please login - No auth error",
            });
            return;
        }
        const token = authHeader.split("")[1];
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({
                message: "INVALID TOKEN!!",
            });
            return;
        }
        req.user = decodedValue.user;
    }
    catch (error) {
        res.status(401).json({
            message: "please Login - JWT error ",
        });
    }
};
