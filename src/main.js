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
  let output_url = `${url_obj.host}${url_obj.pathname}`;
  if (output_url.slice(-1) === "/") {
    output_url = output_url.slice(0, -1);
  }
  return output_url;
}

function crawl_page(urls_to_crawl, crawled_urls) {
  let target_url = urls_to_crawl.pop();
}

async function main() {
  if (argv.length != 3) {
    console.log("Usage node main.js <base_url>");
    process.exit(1);
  }
  let url_to_index = argv[2];
  console.log(`Indexing: ${url_to_index}!`);

  let res = await fetch(url_to_index, {
    method: 'GET',
  });
  if (!res.ok) {
    console.log("Request Failed");
    process.exit(2);
  }
  if (!res.headers.get("Content-Type").includes("text/html")) {
    console.log("Response Not HTML");
  }
  let res_text = await res.text();
  console.log(extract_urls_from_html(res_text, url_to_index));
}

await main();

export { normalize_url, extract_urls_from_html };
