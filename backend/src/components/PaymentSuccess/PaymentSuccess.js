import React, { useEffect, useState } from 'react';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener referencia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('ref') || urlParams.get('id');

    if (reference) {
      // Consultar estado de la transacción
      fetch(`http://localhost:5000/api/payments/transaction/${reference}`)
        .then(res => res.json())
        .then(data => {
          setTransactionInfo(data.transaction);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="loading-spinner">Cargando...</div>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: '✅',
          title: '¡Pago Exitoso!',
          message: 'Tu pedido ha sido confirmado',
          color: '#2ecc71'
        };
      case 'PENDING':
        return {
          icon: '⏳',
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado',
          color: '#f39c12'
        };
      case 'DECLINED':
        return {
          icon: '❌',
          title: 'Pago Rechazado',
          message: 'Tu pago no pudo ser procesado',
          color: '#e74c3c'
        };
      default:
        return {
          icon: 'ℹ️',
          title: 'Estado Desconocido',
          message: 'Verificando estado del pago',
          color: '#95a5a6'
        };
    }
  };

  const statusInfo = transactionInfo 
    ? getStatusInfo(transactionInfo.status)
    : { icon: '📝', title: 'Pedido Recibido', message: 'Gracias por tu compra', color: '#3498db' };

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon" style={{ color: statusInfo.color }}>
          {statusInfo.icon}
        </div>

        <h1>{statusInfo.title}</h1>
        <p className="success-message">{statusInfo.message}</p>

        {transactionInfo && (
          <div className="transaction-details">
            <h3>Detalles de la Transacción</h3>
            <div className="detail-row">
              <span className="detail-label">Referencia:</span>
              <span className="detail-value">{transactionInfo.reference}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Monto:</span>
              <span className="detail-value">
                ${(transactionInfo.amount_in_cents / 100).toFixed(2)} COP
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Método de Pago:</span>
              <span className="detail-value">
                {transactionInfo.payment_method_type === 'CARD' ? 'Tarjeta' : 
                 transactionInfo.payment_method_type === 'PSE' ? 'PSE' :
                 transactionInfo.payment_method_type === 'NEQUI' ? 'Nequi' :
                 transactionInfo.payment_method_type}
              </span>
            </div>
            {transactionInfo.status === 'APPROVED' && (
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{transactionInfo.customer_email}</span>
              </div>
            )}
          </div>
        )}

        <div className="success-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Volver al Inicio
          </button>
          
          {transactionInfo?.status === 'APPROVED' && (
            <button 
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              Imprimir Comprobante
            </button>
          )}
        </div>

        {transactionInfo?.status === 'APPROVED' && (
          <div className="next-steps">
            <h3>Próximos Pasos</h3>
            <ul>
              <li>✉️ Recibirás un email de confirmación</li>
              <li>📦 Tu pedido será procesado en las próximas 24 horas</li>
              <li>🚚 Te notificaremos cuando sea enviado</li>
            </ul>
          </div>
        )}

        {transactionInfo?.status === 'PENDING' && (
          <div className="pending-info">
            <p>⏳ Si pagaste con PSE, el proceso puede tardar unos minutos.</p>
            <p>Te enviaremos un email cuando se confirme tu pago.</p>
          </div>
        )}

        {transactionInfo?.status === 'DECLINED' && (
          <div className="declined-info">
            <p>Por favor verifica:</p>
            <ul>
              <li>Que los datos de tu tarjeta sean correctos</li>
              <li>Que tengas fondos suficientes</li>
              <li>Contacta a tu banco si el problema persiste</li>
            </ul>
            <button 
              className="btn btn-accent"
              onClick={() => window.location.href = '/'}
            >
              Intentar Nuevamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;