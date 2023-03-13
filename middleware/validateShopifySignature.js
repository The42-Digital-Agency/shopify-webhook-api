const crypto = require('crypto')
const SHOPIFY_SIGNATURE_SECRET = process.env.SHOPIFY_SIGNATURE_SECRET
if (!SHOPIFY_SIGNATURE_SECRET) {
    throw new Error('Please provide process.env.SHOPIFY_SIGNATURE_SECRET')
}
function validateShopifySignature() {
    return async (req, res, next) => {
        try {
            const rawBody = req.rawBody
            if (typeof rawBody == 'undefined') {
                throw new Error(
                    'validateShopifySignature: req.rawBody is undefined. Please make sure the raw request body is available as req.rawBody.'
                )
            }
            const hmac = req.headers['x-shopify-hmac-sha256']
            const hash = crypto
                .createHmac('sha256', SHOPIFY_SIGNATURE_SECRET)
                .update(rawBody)
                .digest('base64')
            const signatureOk = crypto.timingSafeEqual(
                Buffer.from(hash),
                Buffer.from(hmac)
            )
            if (!signatureOk) {
                res.status(403)
                res.send('Unauthorized')
                return
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = validateShopifySignature;