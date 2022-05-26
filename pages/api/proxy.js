/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
var HttpsProxyAgent = require('https-proxy-agent');

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(404).json({message: 'Endpoint not found'});

    return;
  }

  const { cardNumber, cardExpiration, cardCvc } = req.body;

  try {
    var agent = new HttpsProxyAgent(`https://${process.env.VGS_USERNAME}:${process.env.VGS_PASSWORD}@${process.env.NEXT_PUBLIC_VGS_VAULT_ID}.sandbox.verygoodproxy.com:8443`);

    const { data }  = await axios.post(
      'https://api.basistheory.com/tokenize', 
      {
        type: 'token',
        data: {
          number: cardNumber,
          expiration_date: cardExpiration,
          cvc: cardCvc
        },
        privacy: {
          classification: 'pci',
          impact_level: 'high'
        }
      }, 
      {
        httpsAgent: agent,
        headers: {
          "BT-API-KEY": process.env.BASIS_THEORY_SERVER_APPLICATION,
          "Content-Type": 'application/json'
        }
      });

    res.status(200).json(data);
  } catch (err) {
      console.error(err);
  }
}
