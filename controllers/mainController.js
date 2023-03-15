const fetch                                        = require('node-fetch');
const requestStructure                             = require('../requestOptions/requestOptions');
const { startEdit, addVariantToOrder, commitEdit } = require('../graphqlRequests/mutations');
const { getOrder } = require('../graphqlRequests/queries');
class MainController {
    async getWebHook(req, res) {
        try {
            if ((req.body.discount_codes).length > 0) {
                res.status(200).send();

                const fetchEditOrder = async (args) => {
                    let lastOrderId = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response.data.orders.edges[0].node.id);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });

                        

                    let editOrder = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(startEdit(await lastOrderId)))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response.data.orderEditBegin.calculatedOrder.id);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });

                    const orderEdit = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(addVariantToOrder(await editOrder, "gid://shopify/ProductVariant/44695914873106")))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });
                        console.log('Последний заказ был успешно отредактирован',await orderEdit);
                    let commitOrder = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(commitEdit(await editOrder)))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });
                    console.log('Бесплатный продукт был добавлен в последний заказ', await commitOrder);
             };

                fetchEditOrder(getOrder());
            }

        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new MainController;