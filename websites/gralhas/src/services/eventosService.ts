import { eventosBucket, supabase } from '@/services/supabase';

export interface Evento {
    id: string;
    titulo: string;
    capa: string;
    descricao: string;
    fotos: string[];
}

interface FotoRow {
    url: string;
    ordem: number;
}

interface EventoRow {
    id: string;
    titulo: string;
    descricao: string;
    capa_url: string | null;
    evento_fotos: FotoRow[] | null;
}

export interface NovoEvento {
    titulo: string;
    slug: string;
    descricao: string;
    capa: File;
    galeria: File[];
}

export function ficheirosDe(valor: File | File[] | null | undefined) {
    if (!valor) return [];
    return (Array.isArray(valor) ? valor : [valor]).filter((file) => file instanceof File);
}

function nomeSeguro(nome: string) {
    const limpo = nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return limpo || 'foto';
}

async function enviarFicheiro(slug: string, file: File) {
    const caminho = `${slug}/${crypto.randomUUID()}-${nomeSeguro(file.name)}`;
    const { error } = await supabase.storage.from(eventosBucket).upload(caminho, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(eventosBucket).getPublicUrl(caminho);
    return data.publicUrl;
}

export async function listarEventos() {
    const { data, error } = await supabase.from('eventos').select('id, titulo, descricao, capa_url, evento_fotos(url, ordem)').order('criado_em', { ascending: false });

    if (error) throw error;

    return ((data ?? []) as EventoRow[]).map((evento) => ({
        id: evento.id,
        titulo: evento.titulo,
        descricao: evento.descricao,
        capa: evento.capa_url ?? '',
        fotos: (evento.evento_fotos ?? [])
            .slice()
            .sort((a, b) => a.ordem - b.ordem)
            .map((foto) => foto.url),
    }));
}

export async function criarEvento(input: NovoEvento) {
    const capaUrl = await enviarFicheiro(input.slug, input.capa);
    const fotosUrls: string[] = [];

    for (const foto of input.galeria) {
        fotosUrls.push(await enviarFicheiro(input.slug, foto));
    }

    const { data, error } = await supabase
        .from('eventos')
        .insert({
            titulo: input.titulo.trim(),
            slug: input.slug,
            descricao: input.descricao.trim(),
            capa_url: capaUrl,
        })
        .select('id')
        .single();

    if (error || !data) throw error ?? new Error('O evento não foi criado.');

    if (!fotosUrls.length) return;

    const { error: fotosError } = await supabase.from('evento_fotos').insert(
        fotosUrls.map((url, ordem) => ({
            evento_id: data.id,
            url,
            nome: input.galeria[ordem]?.name ?? null,
            ordem,
        })),
    );

    if (fotosError) {
        await supabase.from('eventos').delete().eq('id', data.id);
        throw fotosError;
    }
}

export function mensagemDeErro(error: unknown) {
    const detalhe = error as { message?: string; code?: string };

    if (detalhe.code === '23505') {
        return 'Já existe um evento com este identificador. Experimenta um título ligeiramente diferente.';
    }

    const mensagem = detalhe.message ?? '';
    if (mensagem.toLowerCase().includes('bucket') || mensagem.includes('NoSuchBucket')) {
        return `Não encontrei o bucket público "${eventosBucket}". Cria-o no Storage do Supabase com esse nome e marca-o como público.`;
    }

    return mensagem || 'Não foi possível concluir a operação.';
}
