const MercadoPago = require('mercadopago');

const getFullUrl = (req) =>{
    const url = req.protocol + '://' + req.get('host');
    return url;
}
const MP_TOKEN_HERE = "";


module.exports = {
    async checkout(req, res){

        MercadoPago.configure({
            sandbox: true,
            access_token: MP_TOKEN_HERE
        });

        const { id, email, description, amount } = req.params;

        //Create purchase item object template
        const purchaseOrder = {
            items: [
              item = {
                id: id,
                title: description,
                description : description,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(amount)
              }
            ],
            payer : {
              email: email
            },
            auto_return : "all",
            external_reference : id,
            back_urls : {
              success : getFullUrl(req) + "/payments/success",
              pending : getFullUrl(req) + "/payments/pending",
              failure : getFullUrl(req) + "/payments/failure",
            }
          }
      
          //Generate init_point to checkout
          try {
            const preference = await MercadoPago.preferences.create(purchaseOrder);
            return res.redirect(`${preference.body.init_point}`);
          }catch(err){
            return res.send(err.message);
          }
    }
}