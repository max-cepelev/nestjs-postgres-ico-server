import { Injectable } from '@nestjs/common';

interface HttpResponse<T> extends Response {
  data?: T;
}

@Injectable()
export class FetchService {
  async http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(request);
    try {
      // may error if there is no body
      response.data = await response.json();
    } catch (ex) {}

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  }
  async get<T>({
    path,
    args = { method: 'GET' },
    params,
    timeout,
  }: {
    path: string;
    args?: RequestInit;
    params?: any;
    timeout?: number;
  }): Promise<HttpResponse<T>> {
    let url = path;
    let timeoutId = null;
    if (params) {
      url += '?' + new URLSearchParams(params).toString();
    }
    if (timeout) {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeout);
      args.signal = controller.signal;
    }
    const response = await this.http<T>(new Request(url, args));
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    return response;
  }

  async post<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'POST', body: JSON.stringify(body) },
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args));
  }

  async put<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'PUT', body: JSON.stringify(body) },
  ): Promise<HttpResponse<T>> {
    return await this.http<T>(new Request(path, args));
  }
}
