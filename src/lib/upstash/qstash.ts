import { Client } from "@upstash/qstash"

// Initialize QStash client
export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})

// QStash service for handling background jobs and notifications
export class QStashService {
  /**
   * Publish a message to a URL endpoint
   */
  static async publish(url: string, body?: any, options?: {
    delay?: number // Delay in seconds
    headers?: Record<string, string>
    retries?: number
  }): Promise<{ messageId?: string; success: boolean }> {
    try {
      const result = await qstash.publish({
        url,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        delay: options?.delay,
        retries: options?.retries || 3,
      })

      return {
        messageId: result.messageId,
        success: true
      }
    } catch (error) {
      console.error('QStash publish error:', error)
      return { success: false }
    }
  }

  /**
   * Schedule a message to be sent at a specific time
   */
  static async schedule(
    url: string, 
    scheduledTime: Date, 
    body?: any,
    options?: {
      headers?: Record<string, string>
      retries?: number
    }
  ): Promise<{ messageId?: string; success: boolean }> {
    try {
      const delay = Math.floor((scheduledTime.getTime() - Date.now()) / 1000)
      
      if (delay <= 0) {
        throw new Error('Scheduled time must be in the future')
      }

      return await this.publish(url, body, {
        delay,
        headers: options?.headers,
        retries: options?.retries,
      })
    } catch (error) {
      console.error('QStash schedule error:', error)
      return { success: false }
    }
  }

  /**
   * Send email notification via webhook
   */
  static async sendEmailNotification(data: {
    to: string
    subject: string
    html: string
    type: 'contact' | 'portfolio' | 'auth' | 'system'
  }): Promise<{ success: boolean }> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/email`
    
    return await this.publish(webhookUrl, data, {
      headers: {
        'x-webhook-type': 'email-notification',
      },
      retries: 2,
    })
  }

  /**
   * Trigger portfolio image processing
   */
  static async processPortfolioImages(data: {
    portfolioId: string
    imageUrls: string[]
    userId?: string
  }): Promise<{ success: boolean }> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/portfolio-process`
    
    return await this.publish(webhookUrl, data, {
      headers: {
        'x-webhook-type': 'portfolio-processing',
      },
      delay: 5, // 5 second delay to allow database to be updated
      retries: 3,
    })
  }

  /**
   * Schedule regular data backups
   */
  static async scheduleDataBackup(backupType: 'portfolio' | 'users' | 'full'): Promise<{ success: boolean }> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/backup`
    
    // Schedule for 2 AM daily
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(2, 0, 0, 0)
    
    return await this.schedule(webhookUrl, tomorrow, { backupType }, {
      headers: {
        'x-webhook-type': 'data-backup',
      },
      retries: 1,
    })
  }

  /**
   * Send analytics data processing job
   */
  static async processAnalytics(data: {
    type: 'page_view' | 'portfolio_view' | 'contact_form' | 'user_action'
    metadata: Record<string, any>
    timestamp?: string
  }): Promise<{ success: boolean }> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/analytics`
    
    return await this.publish(webhookUrl, {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    }, {
      headers: {
        'x-webhook-type': 'analytics-processing',
      },
      retries: 1,
    })
  }

  /**
   * Send system health check notification
   */
  static async sendHealthCheckAlert(data: {
    service: string
    status: 'up' | 'down' | 'degraded'
    message: string
    timestamp?: string
  }): Promise<{ success: boolean }> {
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/health-check`
    
    return await this.publish(webhookUrl, {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    }, {
      headers: {
        'x-webhook-type': 'health-check',
      },
      retries: 2,
    })
  }
}

// Webhook endpoint builders
export const WEBHOOK_ENDPOINTS = {
  EMAIL: '/api/webhooks/email',
  PORTFOLIO_PROCESS: '/api/webhooks/portfolio-process',
  BACKUP: '/api/webhooks/backup',
  ANALYTICS: '/api/webhooks/analytics',
  HEALTH_CHECK: '/api/webhooks/health-check',
} as const

// Common job types
export const JOB_TYPES = {
  EMAIL_NOTIFICATION: 'email-notification',
  PORTFOLIO_PROCESSING: 'portfolio-processing',
  DATA_BACKUP: 'data-backup',
  ANALYTICS_PROCESSING: 'analytics-processing',
  HEALTH_CHECK: 'health-check',
} as const 