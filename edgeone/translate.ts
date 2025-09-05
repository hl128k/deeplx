import {
  type SourceLanguage,
  type TargetLanguage,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_ERROR,
  abbreviateLanguage,
  translate,
  HTTP_STATUS_BAD_REQUEST,
} from '@deeplx/core'

export interface RequestParams {
  text: string
  source_lang?: SourceLanguage
  target_lang: TargetLanguage
}

// EdgeOne 边缘函数入口点
export default async function handler(request: Request): Promise<Response> {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // 设置 CORS 响应头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  // GET 请求返回 API 说明
  if (request.method === 'GET') {
    return new Response(
      `DeepL Translate Api

POST {"text": "have a try", "source_lang": "auto", "target_lang": "ZH"} to /translate

https://github.com/un-ts/deeplx`,
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      },
    )
  }

  // 只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        code: HTTP_STATUS_BAD_REQUEST,
        data: 'Method not allowed',
      }),
      {
        status: HTTP_STATUS_BAD_REQUEST,
        headers: corsHeaders,
      },
    )
  }

  try {
    // 解析请求体
    const body = (await request.json()) as RequestParams

    const { text, source_lang: sourceLang, target_lang: targetLang } = body

    if (!text) {
      return new Response(
        JSON.stringify({
          code: HTTP_STATUS_BAD_REQUEST,
          data: 'Text is required',
        }),
        {
          status: HTTP_STATUS_BAD_REQUEST,
          headers: corsHeaders,
        },
      )
    }

    if (!abbreviateLanguage(targetLang)) {
      return new Response(
        JSON.stringify({
          code: HTTP_STATUS_BAD_REQUEST,
          data: 'Invalid target language',
        }),
        {
          status: HTTP_STATUS_BAD_REQUEST,
          headers: corsHeaders,
        },
      )
    }

    // 执行翻译
    const translation = await translate(text, targetLang, sourceLang)

    return new Response(
      JSON.stringify({
        code: HTTP_STATUS_OK,
        data: translation,
      }),
      {
        status: HTTP_STATUS_OK,
        headers: corsHeaders,
      },
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)

    return new Response(
      JSON.stringify({
        code: HTTP_STATUS_INTERNAL_ERROR,
        data: errorMessage,
      }),
      {
        status: HTTP_STATUS_INTERNAL_ERROR,
        headers: corsHeaders,
      },
    )
  }
}
