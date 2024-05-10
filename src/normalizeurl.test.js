import { test, expect } from '@jest/globals';
import { normalize_url, extract_urls_from_html } from './main';

test('test url normalization', () => {
  expect(normalize_url("https://google.com/")).toBe("google.com")
  expect(normalize_url("https://google.com")).toBe("google.com")
  expect(normalize_url("http://google.com/")).toBe("google.com")
  expect(normalize_url("http://google.com")).toBe("google.com")

  expect(normalize_url("https://google.com/path")).toBe("google.com/path")
  expect(normalize_url("http://google.com/path")).toBe("google.com/path")

  expect(normalize_url("/path", "https://google.com")).toBe("google.com/path")
  expect(normalize_url("/path", "http://google.com")).toBe("google.com/path")
  expect(normalize_url("/path", "https://google.com/")).toBe("google.com/path")
  expect(normalize_url("/path", "http://google.com/")).toBe("google.com/path")
});

test('test url extraction', () => {
  expect(extract_urls_from_html(`
    <html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
            <a href="https://blog.boot.dev/1"><span>Go to Boot.dev</span></a>
            <a href="/1"><span>Go to Boot.dev</span></a>
            <a href="/test/view/abc"><span>Go to Boot.dev</span></a>
        </body>
    </html>`,
    "https://blog.boot.dev")).toStrictEqual([
      'blog.boot.dev', 
      'blog.boot.dev/1', 
      'blog.boot.dev/1', 
      'blog.boot.dev/test/view/abc'
  ]);
})
