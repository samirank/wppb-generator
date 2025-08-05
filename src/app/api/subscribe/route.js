import MailerLite from '@mailerlite/mailerlite-nodejs'

export async function POST(request) {
  try {
    const mailerlite = new MailerLite({
      api_key: process.env.NEXT_PUBLIC_MAILERLITE_API_KEY,
    })

    const data = await request.json()
    const params = {
      email: data.email,
      status: 'active',
    }

    const response = await mailerlite.subscribers.createOrUpdate(params)
    // get the user id
    const userId = response?.data?.data?.id

    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'Error creating subscriber' }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    // add subscriber to group
    await mailerlite.groups.assignSubscriber(
      userId,
      process.env.NEXT_PUBLIC_MAILERLITE_GROUP_ID,
    )

    // Return NextResponse
    return new Response(JSON.stringify({ message: 'Subscribed' }), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.error('Error subscribing:', error)
    return new Response(
      JSON.stringify({ message: 'Failed to subscribe. Please try again.' }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    )
  }
}
