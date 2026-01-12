import { EventEmitter } from 'events';
import { aiRegistry } from '../ai/modelRegistry';
import { AiGenerationResult } from '../ai/aiTypes';
import { generateColdEmailPrompt } from '../ai/promptTemplates';
import prisma from '../../lib/prisma';

export interface Job {
    id: string;
    leadId?: string;
    data: any;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: AiGenerationResult;
    error?: string;
}

class JobQueue extends EventEmitter {
    private queue: Job[] = [];
    private isProcessing: boolean = false;

    constructor() {
        super();
    }

    addJob(record: any, leadId?: string): string {
        const id = Math.random().toString(36).substring(7);
        const job: Job = {
            id,
            leadId,
            data: record,
            status: 'pending',
        };
        this.queue.push(job);
        this.emit('jobAdded', job);
        this.processQueue();
        return id;
    }

    getQueueStatus() {
        return {
            total: this.queue.length,
            pending: this.queue.filter(j => j.status === 'pending').length,
            completed: this.queue.filter(j => j.status === 'completed').length,
            failed: this.queue.filter(j => j.status === 'failed').length,
        };
    }

    private async processQueue() {
        if (this.isProcessing) return;

        const pendingJob = this.queue.find(j => j.status === 'pending');
        if (!pendingJob) return;

        this.isProcessing = true;
        pendingJob.status = 'processing';
        this.emit('jobStart', pendingJob);

        try {
            const prompt = generateColdEmailPrompt(pendingJob.data);
            const result = await aiRegistry.generateWithFallback(prompt);

            pendingJob.status = 'completed';
            pendingJob.result = result;

            // Persist to Database if leadId provided
            if (pendingJob.leadId) {
                try {
                    await prisma.lead.update({
                        where: { id: pendingJob.leadId },
                        data: {
                            status: 'GENERATED',
                            emailContent: {
                                create: {
                                    subject: "Your personalized email", // Default for now
                                    body: result.content
                                }
                            }
                        }
                    });
                } catch (dbError) {
                    console.error('[Queue] Failed to update lead in DB:', dbError);
                }
            }

            this.emit('jobComplete', pendingJob);

        } catch (error: any) {
            console.error(`Job ${pendingJob.id} failed:`, error);
            pendingJob.status = 'failed';
            pendingJob.error = error.message;

            if (pendingJob.leadId) {
                await prisma.lead.update({
                    where: { id: pendingJob.leadId },
                    data: { status: 'FAILED' }
                }).catch(() => { });
            }

            this.emit('jobFail', pendingJob);
        } finally {
            this.isProcessing = false;
            this.processQueue();
        }
    }
}

export const jobQueue = new JobQueue();
