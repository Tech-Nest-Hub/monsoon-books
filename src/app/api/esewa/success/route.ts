// app/api/esewa/success/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const data = searchParams.get('data')
    
    console.log('eSewa callback received:', { data: data?.substring(0, 100) })
    
    if (!data) {
      console.error('No data parameter received')
      return NextResponse.redirect(new URL('/payment/failure', req.url))
    }
    
    // Decode the base64 response
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString())
    console.log('Decoded payment data:', decodedData)
    
    const { transaction_uuid, total_amount, product_code, status } = decodedData
    
    if (status === 'COMPLETE') {
      // Update payment status in database
      await prisma.payment.update({
        where: { transactionUuid: transaction_uuid },
        data: {
          status: 'COMPLETED',
          transactionId: transaction_uuid,
          completedAt: new Date(),
        },
      })
      
      return NextResponse.redirect(
        new URL(`/payment/success?ref=${transaction_uuid}`, req.url)
      )
    }
    
    return NextResponse.redirect(new URL('/payment/failure', req.url))
  } catch (error) {
    console.error('eSewa verification error:', error)
    return NextResponse.redirect(new URL('/payment/failure', req.url))
  }
}