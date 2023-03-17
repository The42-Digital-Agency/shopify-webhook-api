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

function getProduct(reqData) {
  const getProductQuery = `query {
    productVariants(first: 1, query: "sku:${reqData}") {
      edges {
        node {
          id
        }
      }
    }
  }  
  `;
  return getProductQuery;
}

module.exports = { getOrder, getProduct };
