const { createOrder, updateOrderStatus } = require('../models/Order');
const crypto = require('crypto');

// @desc    Webhook de Wompi para confirmar pagos
// @route   POST /api/payments/webhook
// @access  Public (pero validado con firma)
const wompiWebhook = async (req, res) => {
  try {
    const { event, data, signature, timestamp } = req.body;

    // IMPORTANTE: Valida la firma del webhook (seguridad)
    // La firma se genera con: event.name + event.timestamp + integrity_secret
    const integritySecret = process.env.WOMPI_EVENTS_SECRET || 'prod_integrity_Fs6khPwK5l2w9WQ9ixD7xr5jFRRxREHV';
    
    const expectedSignature = crypto
      .createHash('sha256')
      .update(`${event.name}${timestamp}${integritySecret}`)
      .digest('hex');

    // Verifica que la firma sea correcta (evita webhooks falsos)
    if (signature.checksum !== expectedSignature) {
      console.error('Firma de webhook inválida');
      return res.status(401).json({ error: 'Firma inválida' });
    }

    // Procesa el evento según el tipo
    switch (event.name) {
      case 'transaction.updated':
        await handleTransactionUpdate(data.transaction);
        break;
      
      default:
        console.log('Evento no manejado:', event.name);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
};

// Maneja actualizaciones de transacciones
async function handleTransactionUpdate(transaction) {
  const { reference, status, amount_in_cents, customer_email, payment_method_type } = transaction;

  console.log(`Transacción ${reference} - Estado: ${status}`);

  // Actualiza el estado del pedido según el estado de la transacción
  switch (status) {
    case 'APPROVED':
      // Pago aprobado - actualizar orden
      console.log(`✅ Pago aprobado: ${reference} - $${amount_in_cents / 100}`);
      
      // Aquí puedes:
      // - Enviar email de confirmación
      // - Actualizar inventario
      // - Crear registro en base de datos
      // updateOrderStatus(reference, 'approved');
      break;

    case 'DECLINED':
      console.log(`❌ Pago rechazado: ${reference}`);
      // updateOrderStatus(reference, 'declined');
      break;

    case 'VOIDED':
      console.log(`🔄 Pago anulado: ${reference}`);
      // updateOrderStatus(reference, 'voided');
      break;

    case 'ERROR':
      console.log(`⚠️ Error en pago: ${reference}`);
      // updateOrderStatus(reference, 'error');
      break;

    default:
      console.log(`ℹ️ Estado: ${status} - ${reference}`);
  }
}

// @desc    Consultar estado de una transacción
// @route   GET /api/payments/transaction/:reference
// @access  Public
const getTransactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Consulta a la API de Wompi para obtener el estado actual
    const publicKey = process.env.WOMPI_PUBLIC_KEY || 'pub_test_G6lFMgvertIHDOmkShAv3pIE9sleGaBL';
    
    const response = await fetch(
      `https://production.wompi.co/v1/transactions?reference=${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${publicKey}`,
        },
      }
    );

    const data = await response.json();

    res.json({
      success: true,
      transaction: data.data[0] || null,
    });
  } catch (error) {
    console.error('Error consultando transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar estado de la transacción',
    });
  }
};

module.exports = {
  wompiWebhook,
  getTransactionStatus,
};