function getOrder() {
    const getOrderQuery = `
    query {
        orders(first:1, reverse: true) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    return getOrderQuery;
}

module.exports = getOrder;
