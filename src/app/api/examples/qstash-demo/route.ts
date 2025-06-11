import { NextResponse } from 'next/server'
import { QStashService } from '@/lib/upstash/qstash'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { demo, delay = 0 } = body
    
    console.log('📤 Starting QStash demo...', { demo, delay })
    
    // Get the base URL for webhooks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    switch (demo) {
      case 'email': {
        console.log('📧 Scheduling email notification...')
        
        const emailData = {
          to: 'user@example.com',
          subject: 'Welcome to ColorCraft!',
          html: `
            <h1>🎨 Welcome to ColorCraft!</h1>
            <p>Thank you for joining our furniture painting community.</p>
            <p>This email was sent via QStash background processing.</p>
            <p><strong>Scheduled at:</strong> ${new Date().toISOString()}</p>
          `,
          type: 'welcome'
        }
        
        const result = await QStashService.publish(
          `${baseUrl}/api/webhooks/email`,
          emailData,
          { 
            delay: delay, // seconds
            retries: 3,
            headers: {
              'X-Demo-Type': 'email-notification'
            }
          }
        )
        
        return NextResponse.json({
          success: true,
          type: 'email',
          message: delay > 0 
            ? `Email scheduled to be sent in ${delay} seconds`
            : 'Email queued for immediate processing',
          result,
          webhookUrl: `${baseUrl}/api/webhooks/email`,
          estimatedDelivery: new Date(Date.now() + (delay * 1000)).toISOString()
        })
      }
      
      case 'portfolio': {
        console.log('🖼️ Scheduling portfolio processing...')
        
        const portfolioData = {
          portfolioId: 'demo-portfolio-123',
          imageUrls: [
            'https://example.com/before1.jpg',
            'https://example.com/after1.jpg',
            'https://example.com/before2.jpg',
            'https://example.com/after2.jpg'
          ],
          userId: 'demo-user-456'
        }
        
        const result = await QStashService.publish(
          `${baseUrl}/api/webhooks/portfolio-process`,
          portfolioData,
          { 
            delay: delay,
            retries: 2,
            headers: {
              'X-Demo-Type': 'portfolio-processing'
            }
          }
        )
        
        return NextResponse.json({
          success: true,
          type: 'portfolio',
          message: delay > 0 
            ? `Portfolio processing scheduled in ${delay} seconds`
            : 'Portfolio processing queued for immediate execution',
          result,
          portfolioId: portfolioData.portfolioId,
          imageCount: portfolioData.imageUrls.length,
          webhookUrl: `${baseUrl}/api/webhooks/portfolio-process`
        })
      }
      
      case 'batch': {
        console.log('📦 Scheduling batch operations...')
        
        // Schedule multiple different jobs
        const jobs = []
        
        // Job 1: Email after 5 seconds
        const emailJob = await QStashService.publish(
          `${baseUrl}/api/webhooks/email`,
          {
            to: 'batch@example.com',
            subject: 'Batch Job 1: Email',
            html: '<p>This is the first job in the batch sequence.</p>',
            type: 'batch-email'
          },
          { delay: 5, retries: 1 }
        )
        jobs.push({ type: 'email', delay: 5, result: emailJob })
        
        // Job 2: Portfolio processing after 10 seconds
        const portfolioJob = await QStashService.publish(
          `${baseUrl}/api/webhooks/portfolio-process`,
          {
            portfolioId: 'batch-portfolio-789',
            imageUrls: ['https://example.com/batch1.jpg'],
            userId: 'batch-user'
          },
          { delay: 10, retries: 1 }
        )
        jobs.push({ type: 'portfolio', delay: 10, result: portfolioJob })
        
        // Job 3: Another email after 15 seconds
        const finalEmailJob = await QStashService.publish(
          `${baseUrl}/api/webhooks/email`,
          {
            to: 'batch@example.com',
            subject: 'Batch Job 3: Completion',
            html: '<p>This is the final job in the batch sequence.</p>',
            type: 'batch-completion'
          },
          { delay: 15, retries: 1 }
        )
        jobs.push({ type: 'completion-email', delay: 15, result: finalEmailJob })
        
        return NextResponse.json({
          success: true,
          type: 'batch',
          message: 'Batch jobs scheduled successfully',
          jobs,
          totalJobs: jobs.length,
          timeline: {
            start: new Date().toISOString(),
            firstJob: new Date(Date.now() + 5000).toISOString(),
            secondJob: new Date(Date.now() + 10000).toISOString(),
            finalJob: new Date(Date.now() + 15000).toISOString()
          }
        })
      }
      
      default: {
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid demo type',
            availableTypes: ['email', 'portfolio', 'batch'],
            usage: {
              email: 'POST /api/examples/qstash-demo with { "demo": "email", "delay": 30 }',
              portfolio: 'POST /api/examples/qstash-demo with { "demo": "portfolio", "delay": 60 }',
              batch: 'POST /api/examples/qstash-demo with { "demo": "batch" }'
            }
          },
          { status: 400 }
        )
      }
    }
    
  } catch (error) {
    console.error('🚨 QStash demo error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to demonstrate QStash functionality',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get QStash stats/info
    const info = await QStashService.getMessages()
    
    return NextResponse.json({
      success: true,
      message: 'QStash demo information',
      availableDemos: {
        email: {
          description: 'Send email notifications via QStash',
          example: {
            method: 'POST',
            body: { demo: 'email', delay: 30 },
            result: 'Schedules an email to be sent in 30 seconds'
          }
        },
        portfolio: {
          description: 'Process portfolio images asynchronously',
          example: {
            method: 'POST', 
            body: { demo: 'portfolio', delay: 60 },
            result: 'Schedules portfolio processing in 60 seconds'
          }
        },
        batch: {
          description: 'Schedule multiple jobs in sequence',
          example: {
            method: 'POST',
            body: { demo: 'batch' },
            result: 'Schedules 3 jobs: email at 5s, portfolio at 10s, completion email at 15s'
          }
        }
      },
      qstashInfo: info.success ? {
        pendingMessages: info.data?.length || 0,
        recentMessages: info.data?.slice(0, 5) || []
      } : {
        error: 'Could not fetch QStash info',
        details: info.error
      },
      webhookEndpoints: [
        '/api/webhooks/email',
        '/api/webhooks/portfolio-process'
      ],
      tips: [
        'Use delay parameter to schedule jobs for future execution',
        'QStash automatically retries failed jobs based on retry configuration',
        'Monitor job status in Upstash QStash dashboard',
        'Webhook endpoints should handle authentication and validation'
      ]
    })
    
  } catch (error) {
    console.error('🚨 QStash info error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get QStash demo information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 