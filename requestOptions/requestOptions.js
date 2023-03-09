function requestStructure(args) {
    const optionsMutation = {
        method: "post",
        headers: {
            "Content-Type": "application/graphql",
            "X-Shopify-Access-Token": process.env.accessToken
        },
        body: args
    };
    return optionsMutation;
}

module.exports = requestStructure;