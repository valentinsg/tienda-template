import { useState, useEffect } from 'react';
import { toaster } from '../components/ui/toaster';

interface NewsletterResponse {
  error?: string;
  message?: string;
  discountCode?: string;
}

export const useNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/newsletter/check-status", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    } finally {
      setHasCheckedSubscription(true);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!email) {
      toaster.create({
        title: "Error",
        description: "Por favor ingresa tu email",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
      return;
    }

    if (!validateEmail(email)) {
      toaster.create({
        title: "Error",
        description: "Por favor ingresa un email válido",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsletterResponse = await response.json();

      if (data.error === "exists") {
        toaster.create({
          title: "Email ya registrado",
          description: "Este email ya está suscrito a nuestra newsletter",
          duration: 5000,
          meta: {
            closable: true,
          },
        });
      } else if (data.message === "success") {
        toaster.create({
          title: "¡Gracias por suscribirte!",
          description: `Tu código de descuento es: ${data.discountCode}. Te hemos enviado un email con más información.`,
          duration: 7000,
          meta: {
            closable: true,
          },
        });
        setEmail("");
        setIsSubscribed(true);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error:", error);
      toaster.create({
        title: "Error",
        description: "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    isSubscribed,
    hasCheckedSubscription,
    handleSubscribe,
  };
};