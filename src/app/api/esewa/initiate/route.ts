// app/api/esewa/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

// Use the correct test credentials
const ESEWA_MERCHANT_CODE = 'EPAYTEST' // This is the test merchant code
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q' // Test secret key

// For SDK integration (if using their SDK)
const ESEWA_CLIENT_ID = 'JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R'
const ESEWA_CLIENT_SECRET = 'BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ=='

// Gateway URLs
const ESEWA_TEST_GATEWAY = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
const ESEWA_PRODUCTION_GATEWAY = 'https://esewa.com.np/epay/main'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { authId: authUser.id },
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const { amount, productId, productName } = await req.json()
    
    // Generate unique transaction ID
    const transactionUuid = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare data for signature
    const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_CODE}`
    
    console.log('Signature message:', message)
    
    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(message)
      .digest('base64')
    
    console.log('Generated signature:', signature)
    
    // Store payment record in database
    const payment = await prisma.payment.create({
      data: {
        transactionUuid,
        amount: parseFloat(amount),
        productId,
        userId: dbUser.id,
        productName,
        status: 'PENDING',
      },
    })
    
    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/api/esewa/success`
    const failureUrl = `${baseUrl}/payment/failure`
    
    // For eSewa v2 form data
    const formData = {
      amount: amount.toString(),
      failure_url: failureUrl,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: ESEWA_MERCHANT_CODE,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: successUrl,
      tax_amount: '0',
      total_amount: amount.toString(),
      transaction_uuid: transactionUuid,
    }
    
    console.log('Sending to eSewa:', formData)
    
    // Return form data for eSewa
    return NextResponse.json({
      success: true,
      formData: formData,
      paymentId: payment.id,
      gatewayUrl: ESEWA_TEST_GATEWAY,
    })
  } catch (error) {
    console.error('eSewa initiation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}