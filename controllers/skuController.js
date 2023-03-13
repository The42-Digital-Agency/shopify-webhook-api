class SkuController {
    async getSku (req, res) {
        try {
            res.send('Hello');
        }
        catch(e) {
            console.log(e);
        }
    }
}

module.exports = new SkuController;