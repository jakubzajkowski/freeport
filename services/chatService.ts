import ai from "@/lib/gemini";
import { Type } from '@google/genai';
import fs from 'fs/promises'
import path from 'path'


const prompt : string = `
    You are an assistant that collects the following fields to fill a contact form: - Firstname (max 20 characters) - Lastname (max 20 characters) - Email (valid email format) - 
    Reason of contact (max 100 characters) - Urgency (integer from 1 to 10) Ask the user one question at a time. Validate each field before proceeding. Keep track of the answers 
    and provide the current state of the form at any point during the conversation only when the user asks. At the end, return the collected JSON with keys: firstname, lastname, email, reason, urgency.
`

const generateJsonFile = {
    name: 'generate_json_file',
    description: 'If form is filled generate json file',
    parameters: {
        type: Type.OBJECT,
        properties: {
            file: {
                type: Type.STRING,
                description: `collected JSON properly formatted that can easily be converted to a JavaScript object (using JSON.stringify) with keys: firstname, lastname, email, reason, urgency and return to user info that form submitted`
            }
        },
        required: ['file']
    }
};

export const chatProvider = ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
        systemInstruction: prompt,
        tools: [{
            functionDeclarations: [generateJsonFile],
        }],
    },
});


export async function handleChatMessage(message: string): Promise<string> {
    const response = await chatProvider.sendMessage({ message })

    if (response.functionCalls && response.functionCalls.length > 0) {
        const args = response.functionCalls[0].args

        const rawFile = args?.file

        const parsedFile = typeof rawFile === 'string' ? JSON.parse(rawFile) : rawFile

        const filePath = await saveFormJson(parsedFile)

        console.log('Saved form data to:', filePath)

        const followUp = await chatProvider.sendMessage({ message: 'functionCalls done' })
        return followUp.text as string;
    }

    return response.text as string;
}

export async function saveFormJson(data: string) : Promise<string> {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const fileName = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}_form.json`

    const dirPath = path.join(process.cwd(), 'data')
    const filePath = path.join(dirPath, fileName)

    await fs.mkdir(dirPath, { recursive: true })

    const jsonContent = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonContent, 'utf-8')

    return filePath
}