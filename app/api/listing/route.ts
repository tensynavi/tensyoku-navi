import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { companyName, contactName, email, description, jobTitle } = await req.json()

    const { data: company, error: dbError } = await supabaseAdmin
      .from('companies')
      .insert({ name: companyName, contact_name: contactName, email, description, status: 'pending' })
      .select()
      .single()

    if (dbError) throw dbError

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: email,
      metadata: { company_id: company.id, company_name: companyName, job_title: jobTitle || '求人' },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/listing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/listing`,
    })

    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: '【転職Navi】掲載申し込みを受け付けました',
      html: `<p>${contactName} 様<br>申し込みありがとうございます。決済完了後に求人が公開されます。</p>`,
    })

    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: process.env.ADMIN_EMAIL!,
      subject: `【新規申込】${companyName}`,
      html: `<p>会社名：${companyName}<br>メール：${email}</p>`,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '申し込み処理に失敗しました' }, { status: 500 })
  }
}
