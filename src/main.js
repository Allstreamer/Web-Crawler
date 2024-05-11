import { JSDOM } from 'jsdom';
import { argv } from 'node:process';

function extract_urls_from_html(htmlBody, base_url) {
  let dom = new JSDOM(htmlBody);

  let a_tags = dom.window.document.querySelectorAll('a');
  let urls = [];
  a_tags.forEach((link) => {
    urls.push(normalize_url(link.getAttribute("href"), base_url));
  });
  return urls;
}

function normalize_url(url_str, base_url) {
  const url_obj = new URL(url_str, base_url);
  return url_obj_to_normal_url(url_obj);
}

function url_obj_to_normal_url(url_obj) {
  let output_url = `https://${url_obj.host}${url_obj.pathname}`;
  if (output_url.slice(-1) === "/") {
    output_url = output_url.slice(0, -1);
  }
  return output_url;
}

async function crawl_page(base_url, current_url = base_url, pages = new Map()) {
  if ((new URL(current_url)).host != (new URL(base_url)).host) {
    return [];
  }
  if (pages.has(current_url)) {
    pages.set(current_url, pages.get(current_url) + 1);
    return [];
  }
  // console.log(`Indexing: ${current_url}`);

  pages.set(current_url, 1);
  
  try {
    let res = await fetch(current_url, {method:"GET"});
    if (!res.ok) {
      return [];
    }
    if (!res.headers.get("Content-Type").includes("text/html")) {
      return [];
    }
    let res_text = await res.text();
    let found_pages = extract_urls_from_html(res_text, base_url);
    for (let page_link of found_pages) {
      await crawl_page(base_url, page_link, pages);
    }
  }catch (e) {
    console.log(e);
  }
  return pages;
}

async function main() {
  if (argv.length != 3) {
    console.log("Usage node main.js <base_url>");
    process.exit(1);
  }
  let url_to_index = argv[2];
  console.log(`Indexing: ${url_to_index}!`);
  let all_pages = await crawl_page(url_to_index, url_to_index);

  let kv_pages = Array.from(all_pages.entries());

  kv_pages = kv_pages.sort((a, b) => a[1] - b[1]);

  for (let [key, val] of kv_pages) {
    console.log(`${key} = ${val}`);
  }
  console.log(`Found ${all_pages.size} pages`);
}

await main();

export { normalize_url, extract_urls_from_html };
