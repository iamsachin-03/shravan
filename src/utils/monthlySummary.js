import { Timestamp, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export const getMonthKey = (date) => {
  const current = new Date(date);
  return {
    year: current.getFullYear(),
    month: current.getMonth() + 1,
    id: `${current.getFullYear()}_${String(current.getMonth() + 1).padStart(2, '0')}`,
  };
};

export const updateMonthlySummaryForUser = async ({ customer, entryDate, latestAmount }) => {
  const { year, month, id } = getMonthKey(entryDate);
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const paymentsQuery = query(
    collection(db, 'dailyPayments'),
    where('customerId', '==', customer.id),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );

  const paymentsSnapshot = await getDocs(paymentsQuery);
  const totalAmountReceived = paymentsSnapshot.docs.reduce((sum, paymentDoc) => {
    const payment = paymentDoc.data();
    return sum + Number(payment.amountPaid || 0);
  }, 0);

  const remainingAmount = Math.max(0, Number(customer.denomination || 0) - totalAmountReceived);
  const monthPaidUpTo = totalAmountReceived >= Number(customer.denomination || 0) ? month : Number(customer.monthPaidUpTo || 0);

  await setDoc(doc(db, 'userMonthlySummary', `${customer.id}_${id}`), {
    customerId: customer.id,
    accountNumber: customer.accountNumber,
    firstName: customer.firstName,
    lastName: customer.lastName || '',
    year,
    month,
    amountReceived: Number(latestAmount || 0),
    totalAmountReceived,
    remainingAmount,
    denomination: Number(customer.denomination || 0),
    receivedDate: Timestamp.fromDate(new Date(entryDate)),
    agentId: customer.agentId,
    updatedAt: Timestamp.now(),
  }, { merge: true });

  return { totalAmountReceived, remainingAmount, monthPaidUpTo };
};