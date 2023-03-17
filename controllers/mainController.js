const fetch                                                    = require('node-fetch');
const db                                                       = require('../models/index');
const requestStructure                                         = require('../requestOptions/requestOptions');
const { startEdit, addVariantToOrder, commitEdit }             = require('../graphqlRequests/mutations');
const { getOrder, getProduct }                                 = require('../graphqlRequests/queries');
class MainController {
    async getProductSKU (req, res) {
        try {
            if(req.body.sku) {
                await db.products.destroy({ truncate: true }); 
            }
            const saveSKU = await db.products.create({
                sku: req.body.sku
            })
            await saveSKU.save();
            res.json(`SKU ${req.body.sku} был успешно сохранен`);
        }
        catch(e) {
            console.log(e);
        }
    };

    async getWebHook(req, res) {
        try {
            if ((req.body.discount_codes).length > 0) {
                res.status(200).send();
                const getPresent = await db.products.findAll();
                const fetchEditOrder = async (args) => {
                    const freeProduct = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(getProduct(getPresent[0].sku)))
                    .then(res => res.json())
                    .then(response => {
                        try {
                            return JSON.stringify(response.data.productVariants.edges[0].node.id);
                        }
                        catch (e) {
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            console.log(e);
                        }
                    });

                    const lastOrderId = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response.data.orders.edges[0].node.id);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });
                    const editOrder = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(startEdit(await lastOrderId)))
                        .then(res => res.json())
                        .then(response => {
                            try {
                                return JSON.stringify(response.data.orderEditBegin.calculatedOrder.id);
                            }
                            catch (e) {
                                res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(response)}`);
                            }
                        });

                    const orderEdit = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(addVariantToOrder(await editOrder, await freeProduct)))
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
                    const commitOrder = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(commitEdit(await editOrder)))
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