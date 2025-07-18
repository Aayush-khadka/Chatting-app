const Trycatch = (handler) => {
    return async (req, res, Next) => {
        try {
            await handler(req, res, Next);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
export default Trycatch;
