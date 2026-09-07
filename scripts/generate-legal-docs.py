#!/usr/bin/env python3
"""Convert the client's legal .docx files into the TypeScript data the site renders.

The privacy policy and the public offer are delivered as Word documents in four
languages, whose paragraph structure is identical across languages. This script
reads them, decides a type for every paragraph (heading / subheading / appendix
marker / label / plain text) and writes src/data/legal/*.ts.

Usage:
    python3 scripts/generate-legal-docs.py "/path/to/tour docs"

Re-run it whenever the client sends an updated version of a document, then
review the generated diff. Requires no third-party packages.
"""

import json
import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

# Filenames as delivered by the client, per document and language.
SOURCES = {
    "privacy": {
        "ru": "\u041f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435_\u043e_\u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438_FINAL+.docx",
        "en": "Privacy_and_Personal_Data_Policy_EN.docx",
        "de": "Datenschutz_und_Personenbezogene_Daten_DE.docx",
        "uz": "Maxfiylik_va_shaxsga_doir_malumotlar_UZ.docx",
    },
    "offer": {
        "ru": "\u0414\u043e\u0433\u043e\u0432\u043e\u0440 \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u043e\u0439_\u043e\u0444\u0435\u0440\u0442\u044b FINAL+.docx",
        "en": "Public_Offer_Agreement_EN.docx",
        "de": "Vertrag_Oeffentliches_Angebot_DE.docx",
        "uz": "Ommaviy_oferta_shartnomasi_UZ.docx",
    },
}

OUTPUTS = [
    ("privacy", "privacyPolicy", "privacyPolicy.ts"),
    ("offer", "publicOffer", "publicOffer.ts"),
]

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def para_text(p):
    parts = []
    for node in p.iter():
        tag = node.tag.split('}')[-1]
        if tag == 't':
            parts.append(node.text or '')
        elif tag == 'tab':
            parts.append('\t')
        elif tag == 'br':
            parts.append('\n')
    return ''.join(parts)

def para_style(p):
    pPr = p.find('w:pPr', NS)
    if pPr is None:
        return None, False, None
    st = pPr.find('w:pStyle', NS)
    style = st.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if st is not None else None
    numPr = pPr.find('w:numPr', NS)
    is_list = numPr is not None
    ilvl = None
    if is_list:
        lv = numPr.find('w:ilvl', NS)
        if lv is not None:
            ilvl = lv.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
    return style, is_list, ilvl

def all_bold(p):
    runs = p.findall('.//w:r', NS)
    texts = [r for r in runs if r.find('.//w:t', NS) is not None and (r.find('.//w:t', NS).text or '').strip()]
    if not texts:
        return False
    for r in texts:
        rPr = r.find('w:rPr', NS)
        if rPr is None or rPr.find('w:b', NS) is None:
            return False
    return True

def extract(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml'))
    body = root.find('w:body', NS)
    out = []
    for child in body:
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            txt = para_text(child).strip()
            if not txt:
                continue
            style, is_list, ilvl = para_style(child)
            out.append({
                'text': txt,
                'style': style,
                'list': is_list,
                'ilvl': ilvl,
                'bold': all_bold(child),
            })
        elif tag == 'tbl':
            rows = []
            for tr in child.findall('w:tr', NS):
                cells = []
                for tc in tr.findall('w:tc', NS):
                    ctext = ' '.join(para_text(p).strip() for p in tc.findall('w:p', NS)).strip()
                    cells.append(ctext)
                rows.append(cells)
            out.append({'table': rows})
    return out

import json, re, sys

LANGS = ['ru', 'en', 'de', 'uz']

def load(name):
    """Read the four language variants of one document."""
    return {lang: extract(os.path.join(DOCS_DIR, SOURCES[name][lang])) for lang in LANGS}

def clean(t):
    # normalise nbsp + collapse internal newlines/whitespace
    t = t.replace(' ', ' ').replace('\n', ' ')
    return re.sub(r'\s+', ' ', t).strip()

def is_upper(text):
    letters = [c for c in text if c.isalpha()]
    return bool(letters) and all(c.upper() == c for c in letters)

def classify(idx, docs):
    """Decide the block type.

    Bold formatting only makes a block a *candidate* heading: the source
    documents also bold a few plain labels and list items. The Russian text
    (the original the others were translated from) decides the final type.
    """
    ru = clean(docs['ru'][idx]['text'])
    bold_votes = sum(1 for l in LANGS if docs[l][idx].get('bold'))
    if bold_votes < 2:
        return 'p'
    if re.match(r'^[-\u2013\u2014\u2022]', ru):        # bolded list item
        return 'p'
    if re.match(r'^(Приложение|Anhang|Appendix|Ilova|\d+-ILOVA)', ru, re.I):
        return 'appendix'
    if re.match(r'^\d+\.\d+\.', ru):
        return 'h3'
    if re.match(r'^\d+\.', ru):
        return 'h2'
    if is_upper(ru) and len(ru) > 10:                # section / document title
        return 'h2'
    return 'label'                                   # e.g. "Наименование:"

def build(name):
    docs = load(name)
    n = len(docs['ru'])
    assert all(len(docs[l]) == n for l in LANGS), 'length mismatch'
    title = {l: clean(docs[l][0]['text']) for l in LANGS}
    blocks = []
    for i in range(1, n):
        typ = classify(i, docs)
        entry = {'type': typ}
        for l in LANGS:
            entry[l] = clean(docs[l][i]['text'])
        blocks.append(entry)
    return title, blocks

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def emit(name, const_name, title, blocks):
    out = []
    out.append('// Auto-generated from the client-provided .docx documents. Do not edit by hand -')
    out.append('// run scripts/generate-legal-docs.py when the client sends an updated document.')
    out.append('import type { LegalDocument } from "./types";')
    out.append('')
    out.append(f'export const {const_name}: LegalDocument = {{')
    out.append('  title: {')
    for l in LANGS:
        out.append(f'    {l}: {ts_str(title[l])},')
    out.append('  },')
    out.append('  blocks: [')
    for b in blocks:
        out.append('    {')
        out.append(f'      type: {ts_str(b["type"])},')
        for l in LANGS:
            out.append(f'      {l}: {ts_str(b[l])},')
        out.append('    },')
    out.append('  ],')
    out.append('};')
    out.append('')
    return '\n'.join(out)

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(1)

    global DOCS_DIR
    DOCS_DIR = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "src", "data", "legal",
    )

    for name, const_name, fname in OUTPUTS:
        title, blocks = build(name)
        with open(os.path.join(out_dir, fname), "w", encoding="utf-8") as f:
            f.write(emit(name, const_name, title, blocks))
        counts = {}
        for b in blocks:
            counts[b["type"]] = counts.get(b["type"], 0) + 1
        print(f"{fname}: {len(blocks)} blocks {counts}")


if __name__ == "__main__":
    main()
