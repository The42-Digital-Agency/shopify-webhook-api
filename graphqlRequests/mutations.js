function startEdit(orderId) {
    const startMutation = `mutation beginEdit {
        orderEditBegin(id: ${orderId}) {
            calculatedOrder {
                id
            }
            }
        }`;
    return startMutation
};

function addVariantToOrder(calcultedOrderId, variantId) {
    const addVariantToOrderMutation = `mutation addVariantToOrder{
        orderEditAddVariant(id: ${calcultedOrderId}, variantId: ${variantId}, quantity: 1){
          calculatedOrder {
            id
            addedLineItems(first:5) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    return addVariantToOrderMutation
};

function commitEdit(calcultedOrderId) {
    const commitEditMutation = `mutation commitEdit {
        orderEditCommit(id: ${calcultedOrderId}, notifyCustomer: false, staffNote: "I edited the order! It was me!") {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }      
      `;
    return commitEditMutation;
};

module.exports = { startEdit, addVariantToOrder, commitEdit }

