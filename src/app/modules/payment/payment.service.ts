import prisma from '../../prisma';
import { v4 as uuidv4 } from 'uuid';
import { initiatePayment, verifyPayment } from './payment.utils';

const createPaymentIntoDB = async (
  totalAmount: number,
  customerName: string,
  customerEmail: string,
) => {
  const transactionId = uuidv4();

  await prisma.payment.create({
    data: {
      transactionId,
      totalAmount,
      customerName,
      customerEmail,
    },
  });

  const paymentData = {
    transactionId,
    totalAmount,
    customerName,
    customerEmail,
    customerAddress: 'Dhaka, Bangladesh',
    customerPhone: '+880-17788372355',
  };

  const res = await initiatePayment(paymentData);
  return res;
};

const updateAndConfirmation = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  let result;
  if (verifyResponse && verifyResponse?.pay_status === 'Successful') {
    result = await prisma.payment.update({
      where: { transactionId },
      data: { isConfirmed: 'paid' },
    });
    result = await prisma.user.update({
      where: { email: verifyResponse?.cus_email },
      data: { isPremium: true, verified: true },
    });
  }
  return result;
};

export const PaymentServices = {
  createPaymentIntoDB,
  updateAndConfirmation,
};
