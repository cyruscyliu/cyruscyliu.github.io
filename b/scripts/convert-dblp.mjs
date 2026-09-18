import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import sax from 'sax';

const projectRoot = resolve(new URL('..', import.meta.url).pathname);
const defaultInputDirectory = resolve(projectRoot, 'src/data/tmp');
const defaultOutputFile = resolve(projectRoot, 'src/data/dblp.json');

const publicationTags = new Set([
  'article',
  'book',
  'incollection',
  'inproceedings',
  'inbook',
  'mastersthesis',
  'phdthesis',
  'proceedings',
  'www',
  'data',
]);

const scalarFields = new Set([
  'booktitle',
  'journal',
  'month',
  'number',
  'pages',
  'title',
  'volume',
  'year',
]);

const parseArguments = () => {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');
  return {
    inputDirectory: inputIndex === -1 ? defaultInputDirectory : resolve(process.cwd(), args[inputIndex + 1]),
    outputFile: outputIndex === -1 ? defaultOutputFile : resolve(process.cwd(), args[outputIndex + 1]),
  };
};

const cleanText = (value) => value.replace(/\s+/g, ' ').trim();

const displayName = (name) => name.replace(/\s+\d{4}$/, '');

const cleanTitle = (title) => cleanText(title).replace(/[.。]+$/, '').trim();

const titleIdentity = (title) => cleanTitle(title).normalize('NFKC').toLocaleLowerCase();

const findXmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findXmlFiles(entryPath));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.xml') files.push(entryPath);
  }

  return files;
};

const parseFile = async (filePath) => {
  const xml = await readFile(filePath, 'utf8');
  const publications = [];
  let currentRecord = null;
  let currentField = null;
  let currentText = '';
  let currentAuthor = null;

  const parser = sax.parser(true, { trim: false, normalize: false });

  parser.onopentag = (node) => {
    const name = node.name.toLowerCase();

    if (!currentRecord && publicationTags.has(name)) {
      currentRecord = {
        key: node.attributes.key ?? '',
        type: name,
        attributes: node.attributes,
        authors: [],
        ees: [],
        urls: [],
        fields: {},
      };
      return;
    }

    if (!currentRecord) return;

    if (name === 'author') {
      currentAuthor = { attributes: node.attributes, text: '' };
      return;
    }

    if (name === 'ee' || name === 'url' || scalarFields.has(name)) {
      currentField = name;
      currentText = '';
    }
  };

  parser.ontext = (text) => {
    if (currentAuthor) {
      currentAuthor.text += text;
    } else if (currentField) {
      currentText += text;
    }
  };

  parser.oncdata = (text) => {
    if (currentAuthor) {
      currentAuthor.text += text;
    } else if (currentField) {
      currentText += text;
    }
  };

  parser.onclosetag = (tagName) => {
    const name = tagName.toLowerCase();

    if (currentAuthor && name === 'author') {
      const nameText = cleanText(currentAuthor.text);
      if (nameText) {
        currentRecord.authors.push({
          name: displayName(nameText),
          pid: currentAuthor.attributes.pid ?? '',
          orcid: currentAuthor.attributes.orcid ?? '',
        });
      }
      currentAuthor = null;
      return;
    }

    if (!currentRecord || currentField !== name) {
      if (currentRecord && name === currentRecord.type) {
        publications.push(currentRecord);
        currentRecord = null;
      }
      return;
    }

    const value = cleanText(currentText);
    if (name === 'ee') currentRecord.ees.push(value);
    else if (name === 'url') currentRecord.urls.push(value);
    else if (value) currentRecord.fields[name] = value;
    currentField = null;
    currentText = '';
  };

  parser.onerror = (error) => {
    throw new Error(`${filePath}: ${error.message}`);
  };

  parser.write(xml).close();

  const rootPid = xml.match(/<dblpperson\b[^>]*\bpid="([^"]+)"/)?.[1] ?? '';
  return publications.map((publication) => {
    const fields = publication.fields;
    const doi = publication.ees.find((url) => /doi\.org\//i.test(url)) ?? '';
    const externalUrl = publication.ees.find((url) => !/doi\.org\//i.test(url)) ?? '';
    const relativeDblpUrl = publication.urls.find((url) => url.startsWith('db/')) ?? '';
    const dblpUrl = relativeDblpUrl
      ? `https://dblp.org/${relativeDblpUrl}`
      : `https://dblp.org/rec/${publication.key}.html`;

    return {
      key: publication.key,
      type: publication.type,
      title: cleanTitle(fields.title ?? ''),
      authors: publication.authors.map((author) => ({
        ...author,
        isTarget: Boolean(rootPid && author.pid === rootPid),
      })),
      year: fields.year ? Number(fields.year) : null,
      month: fields.month ?? '',
      venue: fields.journal ?? fields.booktitle ?? '',
      pages: fields.pages ?? '',
      volume: fields.volume ?? '',
      number: fields.number ?? '',
      doi: doi.replace(/^https?:\/\/doi\.org\//i, ''),
      url: externalUrl || doi || dblpUrl,
      dblpUrl,
      sourceFile: relative(projectRoot, filePath),
    };
  });
};

const publicationQuality = (publication) => (
  (publication.pages ? 4 : 0)
  + (publication.doi ? 3 : 0)
  + (publication.venue && publication.venue !== 'CoRR' ? 2 : 0)
  + (publication.url ? 1 : 0)
);

const mergePublication = (first, second) => {
  const preferred = publicationQuality(second) > publicationQuality(first) ? second : first;
  const fallback = preferred === first ? second : first;
  const authors = [...preferred.authors];
  const authorIdentities = new Set(authors.map((author) => author.pid || author.name));

  for (const author of fallback.authors) {
    const identity = author.pid || author.name;
    if (!authorIdentities.has(identity)) {
      authors.push(author);
      authorIdentities.add(identity);
    }
  }

  return {
    ...preferred,
    title: cleanTitle(preferred.title || fallback.title),
    authors,
    year: preferred.year ?? fallback.year,
    month: preferred.month || fallback.month,
    venue: preferred.venue || fallback.venue,
    pages: preferred.pages || fallback.pages,
    volume: preferred.volume || fallback.volume,
    number: preferred.number || fallback.number,
    doi: preferred.doi || fallback.doi,
    url: preferred.url || fallback.url,
    dblpUrl: preferred.dblpUrl || fallback.dblpUrl,
  };
};

const deduplicate = (publications) => {
  const byKey = new Map();
  for (const publication of publications) {
    const identity = publication.key || `${publication.title}:${publication.year}`;
    const existing = byKey.get(identity);
    byKey.set(identity, existing ? mergePublication(existing, publication) : publication);
  }

  const byTitle = new Map();
  for (const publication of byKey.values()) {
    const identity = titleIdentity(publication.title) || `${publication.key}:${publication.year}`;
    const existing = byTitle.get(identity);
    byTitle.set(identity, existing ? mergePublication(existing, publication) : publication);
  }
  return [...byTitle.values()];
};

const { inputDirectory, outputFile } = parseArguments();
const files = (await findXmlFiles(inputDirectory)).sort();

if (!files.length) {
  throw new Error(`No XML files found in ${inputDirectory}`);
}

const parsed = (await Promise.all(files.map((filePath) => parseFile(filePath)))).flat();
const publications = deduplicate(parsed).sort((a, b) => {
  const yearDifference = (b.year ?? 0) - (a.year ?? 0);
  return yearDifference || a.title.localeCompare(b.title);
});

await mkdir(resolve(outputFile, '..'), { recursive: true });
await writeFile(outputFile, `${JSON.stringify({
  sourceFiles: files.map((filePath) => relative(projectRoot, filePath)),
  publications,
}, null, 2)}\n`);

console.log(`Converted ${files.length} XML file(s) into ${publications.length} publication(s).`);
console.log(`Wrote ${relative(projectRoot, outputFile)}.`);
