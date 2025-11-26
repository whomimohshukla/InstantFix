-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('ONLINE_PREPAID', 'POSTPAID_ONLINE', 'POSTPAID_CASH');

-- CreateEnum
CREATE TYPE "BookingPaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUND_PENDING', 'REFUNDED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'ONLINE_PREPAID',
ADD COLUMN     "paymentStatus" "BookingPaymentStatus" NOT NULL DEFAULT 'PENDING';
