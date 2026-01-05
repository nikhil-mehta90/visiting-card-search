function phone(text, keyword) {
  if (!text || !keyword) return "";

  const lines = text.split(/\n/);
  let phones = [];

  lines.forEach(line => {
    const idx = line.toUpperCase().indexOf(keyword.toUpperCase());
    if (idx === -1) return;

    // Only look at text AFTER the keyword
    const afterKeyword = line.substring(idx + keyword.length);

    const match = afterKeyword.match(/\+?(\d[\d\s\-]{0,13}\d)/);
    if (match) phones.push(match[0]);
  });

  return phones.join(" | ");
}
