// EdgeOne worker that mirrors api/translate.ts behavior
import {
  type SourceLanguage,
  type TargetLanguage,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  abbreviateLanguage,
  translate,
} from '@deeplx/core'

interface RequestParams {
  text: string
  source_lang?: SourceLanguage
  target_lang: TargetLanguage
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const isRoot = url.pathname === '/'
    const isTranslate = url.pathname === '/translate'

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    if (request.method === 'GET' && (isRoot || isTranslate)) {
      return new Response(
        `DeepL Translate Api\n\nPOST {"text": "have a try", "source_lang": "auto", "target_lang": "ZH"} to /translate\n\nhttps://github.com/un-ts/deeplx`,
        { headers: { 'Content-Type': 'text/plain', ...CORS } },
      )
    }

    if (request.method !== 'POST' || !(isRoot || isTranslate)) {
      return new Response('Not Found', { status: 404, headers: CORS })
    }

    try {
      const body = (await request.json()) as RequestParams
      const { text, source_lang: sourceLang, target_lang: targetLang } = body

      const headers = { 'Content-Type': 'application/json', ...CORS }

      if (!text) {
        return new Response(
          JSON.stringify({
            code: HTTP_STATUS_BAD_REQUEST,
            data: 'Text is required',
          }),
          { status: HTTP_STATUS_BAD_REQUEST, headers },
        )
      }

      if (!abbreviateLanguage(targetLang)) {
        return new Response(
          JSON.stringify({
            code: HTTP_STATUS_BAD_REQUEST,
            data: 'Invalid target language',
          }),
          { status: HTTP_STATUS_BAD_REQUEST, headers },
        )
      }

      const data = await translate(text, targetLang, sourceLang)
      return new Response(JSON.stringify({ code: HTTP_STATUS_OK, data }), {
        status: HTTP_STATUS_OK,
        headers,
      })
    } catch (err) {
      const headers = { 'Content-Type': 'application/json', ...CORS }
      const message = err instanceof Error ? err.message : String(err)
      return new Response(
        JSON.stringify({ code: HTTP_STATUS_INTERNAL_ERROR, data: message }),
        { status: HTTP_STATUS_INTERNAL_ERROR, headers },
      )
    }
  },
}
