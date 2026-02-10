import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req) {

    console.log("entrou na funçao")
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("entrou na funçao com id: ", id)

    const directoryPath = path.join(process.cwd(), 'public', 'images', 'eventos', `evento${id}`);

    console.log("definiu path: ", directoryPath)

    try {
        const files = await fs.readdir(directoryPath);

        console.log("files: ", files)

        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        return new Response(JSON.stringify({ images }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to read directory or directory does not exist' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
