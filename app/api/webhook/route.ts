import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { company_id, company_name, job_title } = session.metadata

    await supabaseAdmin.from('companies').update({
      status: 'active',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      activated_at: new Date().toISOString(),
    }).eq('id', company_id)

    await supabaseAdmin.from('jobs').update({ status: 'published' }).eq('company_id', company_id)

    const { data: company } = await supabaseAdmin.from('companies').select('email').eq('id', company_id).single()

    if (company?.email) {
      await resend.emails.send({
        from: 'noreply@resend.dev',
        to: company.email,
        subject: '求人が公開されました',
        html: `<p>${company_name}様、求人「${job_title}」が公開されました。</p>`,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    await supabaseAdmin.from('companies').update({ status: 'inactive' }).eq('stripe_subscription_id', subscription.id)
    await supabaseAdmin.from('jobs').update({ status: 'unpublished' }).eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
