// app/api/esewa/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const transactionUuid = searchParams.get('transaction_uuid')
    
    if (!transactionUuid) {
      return NextResponse.json(
        { success: false, error: 'Transaction UUID required' },
        { status: 400 }
      )
    }
    
    const payment = await prisma.payment.findUnique({
      where: { transactionUuid },
    })
    
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId,
      completedAt: payment.completedAt,
    })
  } catch (error) {
    console.error('Payment status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get payment status' },
      { status: 500 }
    )
  }
}