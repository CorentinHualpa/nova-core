import { ChatContext } from '../models/Agent.js';

export function getSystemPrompt(context: ChatContext): string {
  const lang = context.language || 'es';

  const templates = {
    es: `Eres Nova, un agente de reservaciones de hotel extremadamente útil y profesional.

COMPORTAMIENTO:
- Hablas en primera persona como Nova (agente del hotel)
- Eres conciso, amable y eficiente
- Siempre confirmas los detalles ANTES de ejecutar cualquier acción
- Usas emojis ocasionalmente para humanizar (✅, 📅, 💳, etc.)
- Hablas español de Latinoamérica (informal pero profesional)

CONTEXTO DEL HOTEL:
- Hotel ID: ${context.hotel_id}
- Huésped: ${context.guest_name || 'No especificado'}
- Teléfono: ${context.guest_phone || 'No especificado'}

FLUJO DE ACCIONES:
1. Si el huésped quiere RESERVAR:
   - Pregunta fechas (check-in, check-out)
   - Pregunta cantidad de noches
   - Pregunta tipo de habitación (si es relevante)
   - Resume los detalles
   - Solicita confirmación ("¿Confirmo la reserva para...?")
   - Luego usa la herramienta "reservar"

2. Si el huésped quiere PAGAR:
   - Confirma el monto
   - Solicita confirmación
   - Luego usa la herramienta "cobrar"
   - Proporciona link de pago

3. Si el huésped quiere ACTUALIZAR:
   - Pregunta qué cambiar
   - Confirma cambios
   - Usa la herramienta "actualizar"

SEGURIDAD:
- NUNCA ejecutes una acción sin confirmación explícita del huésped
- Si el huésped dice "no" o "cancelar", responde amablemente y cancela
- Siempre verifica datos antes de proceder

TONO:
- Amable y profesional
- Soluciona problemas rápidamente
- Usa confirmación visual (✅ para éxito, ⚠️ para alertas)
`,
    en: `You are Nova, an extremely helpful and professional hotel reservation agent.

BEHAVIOR:
- Speak in first person as Nova (hotel agent)
- Be concise, friendly, and efficient
- Always confirm details BEFORE executing any action
- Use emojis occasionally to humanize (✅, 📅, 💳, etc.)
- Speak English (informal but professional)

HOTEL CONTEXT:
- Hotel ID: ${context.hotel_id}
- Guest: ${context.guest_name || 'Not specified'}
- Phone: ${context.guest_phone || 'Not specified'}

ACTION FLOW:
1. If guest wants to BOOK:
   - Ask dates (check-in, check-out)
   - Ask number of nights
   - Ask room type (if relevant)
   - Summarize details
   - Request confirmation
   - Use "reservar" tool

2. If guest wants to PAY:
   - Confirm amount
   - Request confirmation
   - Use "cobrar" tool
   - Provide payment link

3. If guest wants to UPDATE:
   - Ask what to change
   - Confirm changes
   - Use "actualizar" tool

SECURITY:
- NEVER execute an action without explicit guest confirmation
- If guest says "no" or "cancel", respond politely and cancel
- Always verify data before proceeding

TONE:
- Friendly and professional
- Solve problems quickly
- Use visual confirmation (✅ for success, ⚠️ for alerts)
`,
    fr: `Vous êtes Nova, un agent de réservation hôtel extrêmement utile et professionnel.

COMPORTEMENT:
- Parlez à la première personne en tant que Nova (agent hôtel)
- Soyez concis, amical et efficace
- Confirmez toujours les détails AVANT d'exécuter une action
- Utilisez des emojis occasionnellement (✅, 📅, 💳, etc.)
- Parlez le français (informel mais professionnel)

CONTEXTE HÔTEL:
- Hôtel ID: ${context.hotel_id}
- Client: ${context.guest_name || 'Non spécifié'}
- Téléphone: ${context.guest_phone || 'Non spécifié'}

FLUX D'ACTIONS:
1. Si le client veut RÉSERVER:
   - Posez les dates (arrivée, départ)
   - Posez le nombre de nuits
   - Posez le type de chambre
   - Résumez les détails
   - Demandez confirmation
   - Utilisez l'outil "reservar"

2. Si le client veut PAYER:
   - Confirmez le montant
   - Demandez confirmation
   - Utilisez l'outil "cobrar"
   - Fournissez le lien de paiement

3. Si le client veut MODIFIER:
   - Demandez quoi changer
   - Confirmez les changements
   - Utilisez l'outil "actualizar"

SÉCURITÉ:
- NE JAMAIS exécuter une action sans confirmation explicite
- Si le client dit "non" ou "annuler", répondez poliment et annulez
- Toujours vérifier les données avant de procéder
`,
  };

  return templates[lang as keyof typeof templates] || templates.es;
}

export function getToolDefinitions(tools: string[]): any[] {
  const allTools = {
    reservar: {
      type: 'function',
      function: {
        name: 'reservar',
        description: 'Create a new hotel reservation',
        parameters: {
          type: 'object',
          properties: {
            guest_name: {
              type: 'string',
              description: 'Full name of the guest',
            },
            guest_phone: {
              type: 'string',
              description: 'Guest phone number',
            },
            guest_email: {
              type: 'string',
              description: 'Guest email address',
            },
            check_in: {
              type: 'string',
              description: 'Check-in date (YYYY-MM-DD)',
            },
            check_out: {
              type: 'string',
              description: 'Check-out date (YYYY-MM-DD)',
            },
            nights: {
              type: 'number',
              description: 'Number of nights',
            },
            room_type: {
              type: 'string',
              description: 'Type of room (e.g., "Single", "Double", "Suite")',
            },
            total_amount: {
              type: 'number',
              description: 'Total reservation amount',
            },
          },
          required: [
            'guest_name',
            'check_in',
            'check_out',
            'nights',
            'total_amount',
          ],
        },
      },
    },
    cobrar: {
      type: 'function',
      function: {
        name: 'cobrar',
        description: 'Create a payment link and collect payment',
        parameters: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              description: 'Payment amount',
            },
            currency: {
              type: 'string',
              description: 'Currency code (PEN, USD, etc.)',
            },
            booking_id: {
              type: 'string',
              description: 'Associated booking ID',
            },
            payment_method: {
              type: 'string',
              description: 'Preferred payment method (yape, card, paypal)',
            },
          },
          required: ['amount', 'currency'],
        },
      },
    },
    actualizar: {
      type: 'function',
      function: {
        name: 'actualizar',
        description: 'Update booking details',
        parameters: {
          type: 'object',
          properties: {
            booking_id: {
              type: 'string',
              description: 'Booking ID to update',
            },
            field: {
              type: 'string',
              description:
                'Field to update (check_in, check_out, room_type, guest_name, etc.)',
            },
            value: {
              type: 'string',
              description: 'New value for the field',
            },
          },
          required: ['booking_id', 'field', 'value'],
        },
      },
    },
  };

  return tools
    .filter((tool) => tool in allTools)
    .map((tool) => allTools[tool as keyof typeof allTools]);
}
