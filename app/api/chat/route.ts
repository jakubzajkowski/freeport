import { NextResponse } from 'next/server'
import {handleChatMessage} from "@/services/chatService";

export async function POST(request: Request) {
    try {
        const { message } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const responseText = await handleChatMessage(message)

        return NextResponse.json({ response: responseText })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
    }
}