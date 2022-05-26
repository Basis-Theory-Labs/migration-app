import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

export const useHome = () => {
  const router = useRouter();

  const [form, setForm] = useState({});
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  });

  useEffect(() => {
    if (isLoaded) {
      const vgsForm = window.VGSCollect.create(process.env.NEXT_PUBLIC_VGS_VAULT_ID, 'sandbox', (_) => {});
      setForm(vgsForm);

      vgsForm.field('#cc-holder', {
        type: 'text',
        name: 'card_holder',
        placeholder: 'Card holder',
        validations: ['required'],
      });

      vgsForm.field('#cc-number', {
        type: 'card-number',
        name: 'card_number',
        placeholder: 'Card number',
        showCardIcon: true,
        validations: ['required', 'validCardNumber'],
      });

      vgsForm.field('#cc-cvc', {
        type: 'card-security-code',
        name: 'card_cvc',
        placeholder: 'CVC',
        maxLength: 3,
        validations: ['required', 'validCardSecurityCode'],
      });

      vgsForm.field('#cc-expiration-date', {
        type: 'card-expiration-date',
        name: 'card_exp',
        placeholder: 'MM / YY',
        validations: ['required', 'validCardExpirationDate'],
      });
    }
  }, [isLoaded]);

  const submit = (e) => {
    e.preventDefault();

    form.submit(
      '/post',
      {},
      (_, response) => {
        router.push(`/results?cardHolder=${response.json.card_holder}&cardNumber=${response.json.card_number}&cardExpiration=${response.json.card_exp}&cardCvc=${response.json.card_cvc}`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return {
    submit
  };
}