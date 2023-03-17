const fetch = require('node-fetch');
const db = require('../models/index');
const requestStructure = require('../requestOptions/requestOptions');
const { startEdit, addVariantToOrder, commitEdit } = require('../graphqlRequests/mutations');
const { getOrder, getProduct } = require('../graphqlRequests/queries');
class MainController {
    async getProductSKU(req, res) {
        try {
            if (req.body.sku) {
                await db.products.destroy({ truncate: true });
            }
            const saveSKU = await db.products.create({
                sku: req.body.sku
            })
            await saveSKU.save();
            res.json(`SKU ${req.body.sku} был успешно сохранен`);
        }
        catch (e) {
            console.log(e);
        }
    };

    async getWebHook(req, res) {
        try {
            if ((req.body.discount_codes).length > 0) {
                res.status(200).send();
                const getPresent = await db.products.findAll();
                const fetchEditOrder = async (args) => {
                    const freeProduct = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(getProduct(getPresent[0].sku)))
                        .then(res => res.json())
                        .catch(e =>
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(e)}`)
                        )

                    const lastOrderId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                        .then(res => res.json())
                        .catch(e =>
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(e)}`)
                        );
                    const editOrder = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(startEdit(lastOrderId.data.orders.edges[0].node.id)))
                        .then(res => res.json())
                        .catch(e =>
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(e)}`)
                        );

                    const orderEdit = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(addVariantToOrder(JSON.stringify(editOrder.data.orderEditBegin.calculatedOrder.id), freeProduct.data.productVariants.edges[0].node.id)))
                        .then(res => res.json())
                        .catch(e =>
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(e)}`)
                        );
                    console.log('Последний заказ был успешно отредактирован', JSON.stringify(orderEdit));
                    const commitOrder = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(commitEdit(editOrder.data.orderEditBegin.calculatedOrder.id)))
                        .then(res => res.json())
                        .catch(e =>
                            res.status(300).json(`Проверьте корректность данных и формат ввода. Ошибка - ${JSON.stringify(e)}`)
                        );
                    console.log('Бесплатный продукт был добавлен в последний заказ', JSON.stringify(commitOrder));
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